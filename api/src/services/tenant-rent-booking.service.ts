/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
import {
  NOTIF_TITLE,
  NOTIF_TYPE,
} from "src/common/constant/notifications.constant";
import {
  STALL_ERROR_NOT_FOUND,
  STALL_STATUS,
} from "src/common/constant/stalls.constant";
import {
  TENANTRENTBOOKING_ERROR_NOT_FOUND,
  TENANTRENTBOOKING_STATUS,
} from "src/common/constant/tenant-rent-booking.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateTenantRentBookingDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.create.dto";
import {
  UpdateTenantRentBookingDto,
  UpdateTenantRentBookingStatusDto,
} from "src/core/dto/tenant-rent-booking/tenant-rent-booking.update.dto";
import { Notifications } from "src/db/entities/Notifications";
import { Stalls } from "src/db/entities/Stalls";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { EntityManager, In, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";

@Injectable()
export class TenantRentBookingService {
  constructor(
    @InjectRepository(TenantRentBooking)
    private readonly tenantRentBookingRepo: Repository<TenantRentBooking>,
    private pusherService: PusherService,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.tenantRentBookingRepo.find({
        where: {
          ...condition,
        },
        skip,
        take,
        order,
        relations: {
          stall: {
            stallClassification: {
              thumbnailFile: true,
            },
          },
          requestedByUser: {
            userProfilePic: {
              file: true,
            },
          },
        },
      }),
      this.tenantRentBookingRepo.count({
        where: {
          ...condition,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByCode(tenantRentBookingCode = "") {
    const result = await this.tenantRentBookingRepo.findOne({
      where: {
        tenantRentBookingCode: tenantRentBookingCode?.toString()?.toLowerCase(),
      },
      relations: {
        stall: {
          stallClassification: true,
        },
        requestedByUser: {
          userProfilePic: {
            file: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(TENANTRENTBOOKING_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateTenantRentBookingDto) {
    return await this.tenantRentBookingRepo.manager.transaction(
      async (entityManager) => {
        const tenantRentContract = await entityManager.findOne(
          TenantRentContract,
          {
            where: {
              stall: {
                stallCode: dto.stallCode,
              },
              tenantUser: {
                userCode: dto.requestedByUserCode,
              },
              status: In(["ACTIVE", "RENEWED"]),
            },
          }
        );

        if (tenantRentContract) {
          throw Error(
            "The tenant has a " +
              tenantRentContract.status.toLocaleLowerCase() +
              " booking for the selected stall."
          );
        }
        let tenantRentBooking = await entityManager.findOne(TenantRentBooking, {
          where: {
            stall: {
              stallCode: dto.stallCode,
            },
            requestedByUser: {
              userCode: dto.requestedByUserCode,
            },
            status: In(["PENDING", "PROCESSING"]),
          },
        });
        if (tenantRentBooking) {
          throw Error(
            "The tenant has a " +
              tenantRentBooking.status.toLocaleLowerCase() +
              " booking for the selected stall."
          );
        } else {
          tenantRentBooking = new TenantRentBooking();
        }
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentBooking.dateCreated = timestamp;
        const datePreferedStart = moment(
          new Date(dto.datePreferedStart),
          DateConstant.DATE_LANGUAGE
        ).format("YYYY-MM-DD");
        tenantRentBooking.datePreferedStart = datePreferedStart;

        const tenant = await entityManager.findOne(Users, {
          where: {
            userCode: dto.requestedByUserCode,
            userType: USER_TYPE.TENANT,
          },
        });
        if (!tenant) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentBooking.requestedByUser = tenant;

        const stall = await entityManager.findOne(Stalls, {
          where: {
            stallCode: dto.stallCode,
            status: STALL_STATUS.AVAILABLE,
          },
          relations: {
            stallClassification: true,
          },
        });
        if (!stall) {
          throw Error(STALL_ERROR_NOT_FOUND);
        }
        tenantRentBooking.stall = stall;
        tenantRentBooking.status = TENANTRENTBOOKING_STATUS.PENDING;
        tenantRentBooking = await entityManager.save(tenantRentBooking);
        tenantRentBooking.tenantRentBookingCode = generateIndentityCode(
          tenantRentBooking.tenantRentBookingId
        );
        const title = `New request to rent from ${tenant.fullName}!`;
        const desc = `${tenant.fullName} requested to rent ${stall.name} from ${stall.stallClassification.name}!`;
        const usersToBeNotified = await entityManager.find(Users, {
          where: { userType: USER_TYPE.STAFF },
        });
        const notificationIds = await this.logNotification(
          usersToBeNotified,
          tenantRentBooking,
          entityManager,
          title,
          desc
        );
        await this.syncRealTime(
          usersToBeNotified.map((x) => x.userId),
          tenantRentBooking
        );
        const sendToPushNotif = usersToBeNotified.map((x) => {
          return this.oneSignalNotificationService.sendToExternalUser(
            x.userName,
            "TENANT_RENT_BOOKING",
            tenantRentBooking.tenantRentBookingCode,
            notificationIds,
            title,
            desc
          );
        });
        const pushNotifResults: { userId: string; success: boolean }[] =
          await Promise.all(sendToPushNotif);
        console.log("Push notif results ", JSON.stringify(pushNotifResults));
        tenantRentBooking = await entityManager.save(tenantRentBooking);

        return await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingCode: tenantRentBooking.tenantRentBookingCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
          },
        });
      }
    );
  }

  async update(tenantRentBookingCode, dto: UpdateTenantRentBookingDto) {
    return await this.tenantRentBookingRepo.manager.transaction(
      async (entityManager) => {
        let tenantRentBooking = await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            requestedByUser: true,
          },
        });
        if (!tenantRentBooking) {
          throw Error(TENANTRENTBOOKING_ERROR_NOT_FOUND);
        }

        if (tenantRentBooking.status !== TENANTRENTBOOKING_STATUS.PENDING) {
          throw Error(
            "The booking was already in the state of: " +
              tenantRentBooking.status.toLocaleLowerCase()
          );
        }

        if (tenantRentBooking.stall.stallCode !== dto.stallCode) {
          const stall = await entityManager.findOne(Stalls, {
            where: {
              stallCode: dto.stallCode,
              status: STALL_STATUS.AVAILABLE,
            },
          });
          if (!stall) {
            throw Error(STALL_ERROR_NOT_FOUND);
          }
          tenantRentBooking.stall = stall;
          const tenantRentContract = await entityManager.findOne(
            TenantRentContract,
            {
              where: {
                stall: {
                  stallCode: dto.stallCode,
                },
                tenantUser: {
                  userCode: tenantRentBooking.requestedByUser.userCode,
                },
                status: In(["ACTIVE", "RENEWED"]),
              },
            }
          );

          if (tenantRentContract) {
            throw Error(
              "The tenant has a " +
                tenantRentContract.status.toLocaleLowerCase() +
                " booking for the selected stall."
            );
          }
          const changedTenantRentBooking = await entityManager.findOne(
            TenantRentBooking,
            {
              where: {
                stall: {
                  stallCode: dto.stallCode,
                },
                requestedByUser: {
                  userCode: tenantRentBooking.requestedByUser.userCode,
                },
                status: In(["PENDING", "PROCESSING"]),
              },
            }
          );
          if (changedTenantRentBooking) {
            throw Error(
              "The tenant has a " +
                changedTenantRentBooking.status.toLocaleLowerCase() +
                " booking for the selected stall."
            );
          }
        }

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentBooking.dateCreated = timestamp;
        const datePreferedStart = moment(
          new Date(dto.datePreferedStart),
          DateConstant.DATE_LANGUAGE
        ).format("YYYY-MM-DD");
        tenantRentBooking.datePreferedStart = datePreferedStart;

        tenantRentBooking.status = TENANTRENTBOOKING_STATUS.PENDING;
        tenantRentBooking = await entityManager.save(tenantRentBooking);

        return await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingCode: tenantRentBooking.tenantRentBookingCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            requestedByUser: true,
          },
        });
      }
    );
  }

  async updateStatus(
    tenantRentBookingCode,
    dto: UpdateTenantRentBookingStatusDto
  ) {
    return await this.tenantRentBookingRepo.manager.transaction(
      async (entityManager) => {
        const tenantRentBooking = await entityManager.findOne(
          TenantRentBooking,
          {
            where: {
              tenantRentBookingCode,
            },
            relations: {
              stall: {
                stallClassification: true,
              },
              requestedByUser: true,
            },
          }
        );
        if (!tenantRentBooking) {
          throw Error(TENANTRENTBOOKING_ERROR_NOT_FOUND);
        }
        if (tenantRentBooking.status !== TENANTRENTBOOKING_STATUS.PENDING) {
          throw Error(
            "The booking was already in the state of: " +
              tenantRentBooking.status.toLocaleLowerCase()
          );
        }
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentBooking.dateLastUpdated = timestamp;
        tenantRentBooking.status = dto.status;

        let title;
        let desc;
        const status = tenantRentBooking.status;
        if (status === TENANTRENTBOOKING_STATUS.LEASED) {
          title = NOTIF_TITLE.TENANT_RENT_BOOKING_LEASED;
          desc = `Your request to rent ${tenantRentBooking?.stall?.name} has now been Approved, and the stall is now officially Leased to you!`;
        } else if (status === TENANTRENTBOOKING_STATUS.REJECTED) {
          title = NOTIF_TITLE.TENANT_RENT_BOOKING_REJECTED;
          desc = `Your request to rent ${tenantRentBooking?.stall?.name} was Rejected!`;
        } else {
          title = `Request to rent was ${
            status.toLowerCase().charAt(0).toUpperCase() + status.slice(1)
          }`;
          desc = `Your request to rent ${
            tenantRentBooking?.stall?.name
          } was now being ${
            status.toLowerCase().charAt(0).toUpperCase() + status.slice(1)
          }!`;
        }
        const notificationIds = await this.logNotification(
          [tenantRentBooking.requestedByUser],
          tenantRentBooking,
          entityManager,
          title,
          desc
        );
        const staffusers = await entityManager.find(Users, {
          where: { userType: USER_TYPE.STAFF },
        });
        if (status === TENANTRENTBOOKING_STATUS.CANCELLED) {
          await this.syncRealTime(
            [
              ...staffusers.map((x) => x.userId),
              tenantRentBooking.requestedByUser.userId,
            ],
            tenantRentBooking
          );
        } else {
          await this.syncRealTime(
            [tenantRentBooking.requestedByUser.userId],
            tenantRentBooking
          );
        }
        const pushNotifResults: { userId: string; success: boolean }[] =
          await Promise.all([
            this.oneSignalNotificationService.sendToExternalUser(
              tenantRentBooking.requestedByUser.userName,
              "TENANT_RENT_BOOKING",
              tenantRentBooking.tenantRentBookingCode,
              notificationIds,
              title,
              desc
            ),
          ]);
        console.log("Push notif results ", JSON.stringify(pushNotifResults));
        return await entityManager.save(TenantRentBooking, tenantRentBooking);
      }
    );
  }

  async logNotification(
    users: Users[],
    data: TenantRentBooking,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.TENANT_RENT_BOOKING.toString(),
        referenceId: data.tenantRentBookingCode.toString(),
        isRead: false,
        user: user,
      } as Notifications);
    }
    const res: Notifications[] = await entityManager.save(
      Notifications,
      notifications
    );
    const notificationsIds = res.map((x) => x.notificationId);
    await this.pusherService.sendNotif(
      users.map((x) => x.userId),
      title,
      description
    );
    return notificationsIds;
  }

  async syncRealTime(userIds: string[], data: TenantRentBooking) {
    await this.pusherService.rentBookingChanges(userIds, data);
  }
}
