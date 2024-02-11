import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  PAYMENT_ERROR_NOT_FOUND,
  PAYMENT_STATUS,
} from "src/common/constant/payment.constant";
import { TENANTRENTCONTRACT_ERROR_NOT_FOUND } from "src/common/constant/tenant-rent-contract.constant";
import {
  CONST_QUERYCURRENT_TIMESTAMP,
  getNextDate,
  getNextMonth,
  getNextWeek,
} from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { columnDefToTypeORMCondition, generateIndentityCode } from "src/common/utils/utils";
import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { DateConstant } from "src/common/constant/date.constant";
import moment from "moment";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import { NOTIF_TYPE } from "src/common/constant/notifications.constant";
import { Notifications } from "src/db/entities/Notifications";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { OneSignalNotificationService } from "./one-signal-notification.service";

@Injectable()
export class ContractPaymentService {
  constructor(
    @InjectRepository(ContractPayment)
    private readonly contractPaymentRepo: Repository<ContractPayment>,
    private pusherService: PusherService,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.contractPaymentRepo.find({
        where: condition,
        skip,
        take,
        order,
        relations: {
          user: {
            access: true,
            userProfilePic: {
              file: true,
            },
          },
          tenantRentContract: {
            stall: {
              stallClassification: {
                thumbnailFile: true,
              },
            },
            assignedCollectorUser: {
              userProfilePic: {
                file: true,
              },
            },
            tenantUser: {
              userProfilePic: {
                file: true,
              },
            },
          },
        },
      }),
      this.contractPaymentRepo.count({
        where: condition,
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByCode(contractPaymentCode) {
    const result = await this.contractPaymentRepo.findOne({
      where: {
        contractPaymentCode,
      },
      relations: {
        user: {
          access: true,
          userProfilePic: {
            file: true,
          },
        },
        tenantRentContract: {
          stall: {
            stallClassification: {
              thumbnailFile: true,
            },
          },
          assignedCollectorUser: {
            userProfilePic: {
              file: true,
            },
          },
          tenantUser: {
            userProfilePic: {
              file: true,
            },
          },
        },
      },
    });
    if (!result) {
      throw Error(PAYMENT_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateContractPaymentDto) {
    try {
      return await this.contractPaymentRepo.manager.transaction(
        async (entityManager) => {
          let contractPayment = new ContractPayment();
          contractPayment.referenceNumber = dto.referenceNumber;
          // contractPayment.datePaid = moment(dto.datePaid).format("YYYY-MM-DD");
          const datePaid = moment(
            new Date(dto.datePaid),
            DateConstant.DATE_LANGUAGE
          ).format();
          contractPayment.datePaid = datePaid;
          const dueDateStart = moment(
            new Date(dto.dueDateStart),
            DateConstant.DATE_LANGUAGE
          ).format();
          contractPayment.dueDateStart = dueDateStart;
          const dueDateEnd = moment(
            new Date(dto.dueDateEnd),
            DateConstant.DATE_LANGUAGE
          ).format();
          contractPayment.dueDateEnd = dueDateEnd;
          contractPayment.status = PAYMENT_STATUS.VALID;
          contractPayment.dueAmount = dto.dueAmount.toString();
          contractPayment.overDueAmount = dto.overDueAmount.toString();
          contractPayment.totalDueAmount = dto.totalDueAmount.toString();
          contractPayment.paymentAmount = dto.totalDueAmount.toString();
          const timestamp = await entityManager
            .query(CONST_QUERYCURRENT_TIMESTAMP)
            .then((res) => {
              return res[0]["timestamp"];
            });
          contractPayment.dateCreated = timestamp;
          let tenantRentContract = await entityManager.findOne(
            TenantRentContract,
            {
              where: {
                tenantRentContractCode: dto.tenantRentContractCode,
              },
            }
          );
          if (!tenantRentContract) {
            throw Error(TENANTRENTCONTRACT_ERROR_NOT_FOUND);
          }
          const currenDueDate = moment(
            new Date(dto.dueDateEnd),
            DateConstant.DATE_LANGUAGE
          ).format("YYYY-MM-DD");
          let nextCurrentDueDate;
          if (
            tenantRentContract.stallRateCode.toString().toUpperCase() ===
            "MONTHLY"
          ) {
            const getDateQuery = getNextMonth(currenDueDate);
            nextCurrentDueDate = await entityManager
              .query(getDateQuery)
              .then((res) => {
                return res[0]["nextmonth"];
              });
          } else if (
            tenantRentContract.stallRateCode.toString().toUpperCase() ===
            "WEEKLY"
          ) {
            const getDateQuery = getNextWeek(currenDueDate);
            nextCurrentDueDate = await entityManager
              .query(getDateQuery)
              .then((res) => {
                return res[0]["nextweek"];
              });
          } else {
            const getDateQuery = getNextDate(currenDueDate, 1);
            nextCurrentDueDate = await entityManager
              .query(getDateQuery)
              .then((res) => {
                return res[0]["nextdate"];
              });
          }
          tenantRentContract.currentDueDate = nextCurrentDueDate;
          tenantRentContract = await entityManager.save(
            TenantRentContract,
            tenantRentContract
          );
          contractPayment.tenantRentContract = tenantRentContract;

          const user = await entityManager.findOne(Users, {
            where: {
              userId: dto.paidByUserId,
            },
          });
          if (!user) {
            throw Error(USER_ERROR_USER_NOT_FOUND);
          }
          contractPayment.user = user;
          contractPayment = await entityManager.save(
            ContractPayment,
            contractPayment
          );
          contractPayment.contractPaymentCode = generateIndentityCode(
            contractPayment.contractPaymentId
          );
          contractPayment = await entityManager.save(
            ContractPayment,
            contractPayment
          );

          const title = `Bill Payment received!`;
          const desc = `You've made a payment of PHP ${
            contractPayment.paymentAmount
          } to your Stall rent contract #${
            tenantRentContract.tenantRentContractCode
          } on ${moment(contractPayment.datePaid).format("MMM DD, YYYY")} `;

          const staffUsers = await entityManager.find(Users, {
            where: { userType: USER_TYPE.STAFF },
          });
          tenantRentContract = await entityManager.findOne(TenantRentContract, {
            where: {
              tenantRentContractId: tenantRentContract.tenantRentContractId,
            },
            relations: {
              tenantUser: true,
            },
          });
          contractPayment.tenantRentContract = tenantRentContract;
          const notificationIds = await this.logNotification(
            [tenantRentContract.tenantUser],
            contractPayment,
            entityManager,
            title,
            desc
          );
          await this.syncRealTime(
            [
              ...staffUsers.map((x) => x.userId),
              tenantRentContract.tenantUser.userId,
            ],
            contractPayment
          );
          const pushNotifResults =
            await this.oneSignalNotificationService.sendToExternalUser(
              tenantRentContract.tenantUser.userName,
              "TENANT_RENT_CONTRACT_PAYMENT",
              contractPayment.contractPaymentCode,
              notificationIds,
              title,
              desc
            );
          console.log("Push notif results ", JSON.stringify(pushNotifResults));

          return await entityManager.findOne(ContractPayment, {
            where: {
              contractPaymentId: contractPayment.contractPaymentId,
            },
            relations: {
              user: {
                access: true,
                userProfilePic: {
                  file: true,
                },
              },
              tenantRentContract: {
                stall: {
                  stallClassification: {
                    thumbnailFile: true,
                  },
                },
                assignedCollectorUser: {
                  userProfilePic: {
                    file: true,
                  },
                },
                tenantUser: {
                  userProfilePic: {
                    file: true,
                  },
                },
              },
            },
          });
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async logNotification(
    users: Users[],
    data: ContractPayment,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.TENANT_RENT_CONTRACT_PAYMENT.toString(),
        referenceId: data.contractPaymentCode.toString(),
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

  async syncRealTime(userIds: string[], data: ContractPayment) {
    await this.pusherService.paymentChanges(userIds, data);
  }
}
