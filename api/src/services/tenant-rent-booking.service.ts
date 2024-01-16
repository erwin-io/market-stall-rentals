/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
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
import { Stalls } from "src/db/entities/Stalls";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { In, Repository } from "typeorm";

@Injectable()
export class TenantRentBookingService {
  constructor(
    @InjectRepository(TenantRentBooking)
    private readonly tenantRentBookingRepo: Repository<TenantRentBooking>
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
            stallClassification: true,
          },
          user: {
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
        user: {
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
              user: {
                userCode: dto.userCode,
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
            user: {
              userCode: dto.userCode,
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
            userCode: dto.userCode,
            userType: USER_TYPE.TENANT,
          },
        });
        if (!tenant) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentBooking.user = tenant;

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
        tenantRentBooking.status = TENANTRENTBOOKING_STATUS.PENDING;
        tenantRentBooking = await entityManager.save(tenantRentBooking);

        return await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingId: tenantRentBooking.tenantRentBookingId,
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

  async update(tenantRentBookingId, dto: UpdateTenantRentBookingDto) {
    return await this.tenantRentBookingRepo.manager.transaction(
      async (entityManager) => {
        let tenantRentBooking = await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingId,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            user: true,
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
                user: {
                  userCode: tenantRentBooking.user.userCode,
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
                user: {
                  userCode: tenantRentBooking.user.userCode,
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
            tenantRentBookingId: tenantRentBooking.tenantRentBookingId,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            user: true,
          },
        });
      }
    );
  }

  async updateStaus(
    tenantRentBookingId,
    dto: UpdateTenantRentBookingStatusDto
  ) {
    return await this.tenantRentBookingRepo.manager.transaction(
      async (entityManager) => {
        const tenantRentBooking = await entityManager.findOne(
          TenantRentBooking,
          {
            where: {
              tenantRentBookingId,
            },
            relations: {
              stall: {
                stallClassification: true,
              },
              user: true,
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
        return await entityManager.save(TenantRentBooking, tenantRentBooking);
      }
    );
  }
}
