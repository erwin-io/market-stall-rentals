import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
import {
  STALL_STATUS,
  STALL_ERROR_NOT_FOUND,
  STALL_ERROR_NOT_AVAILABLE,
} from "src/common/constant/stalls.constant";
import {
  TENANTRENTBOOKING_ERROR_NOT_FOUND,
  TENANTRENTBOOKING_STATUS,
} from "src/common/constant/tenant-rent-booking.constant";
import {
  TENANTRENTCONTRACT_ERROR_NOT_FOUND,
  TENANTRENTCONTRACT_STATUS,
} from "src/common/constant/tenant-rent-contract.constant";
import {
  CONST_QUERYCURRENT_TIMESTAMP,
  getNextDate,
  getNextMonth,
  getNextWeek,
} from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import {
  CreateTenantRentContracFromBookingtDto,
  CreateTenantRentContractDto,
} from "src/core/dto/tenant-rent-contract/tenant-rent-contract.create.dto";
import {
  UpdateTenantRentContractDto,
  UpdateTenantRentContractStatusDto,
} from "src/core/dto/tenant-rent-contract/tenant-rent-contract.update.dto";
import { Stalls } from "src/db/entities/Stalls";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { LessThan, LessThanOrEqual, Repository } from "typeorm";

@Injectable()
export class TenantRentContractService {
  constructor(
    @InjectRepository(TenantRentContract)
    private readonly tenantRentContractRepo: Repository<TenantRentContract>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.tenantRentContractRepo.find({
        where: {
          ...condition,
        },
        relations: {
          stall: {
            stallClassification: {
              thumbnailFile: true,
            },
          },
          tenantUser: {
            userProfilePic: true,
          },
          assignedCollectorUser: {
            userProfilePic: {
              file: true,
            },
          },
        },
        skip,
        take,
        order,
      }),
      this.tenantRentContractRepo.count({
        where: {
          ...condition,
        },
      }),
    ]);
    return {
      results: results.map((x) => {
        delete x.tenantUser.password;
        return x;
      }),
      total,
    };
  }

  async getByCode(tenantRentContractCode) {
    const result = await this.tenantRentContractRepo.findOne({
      where: {
        tenantRentContractCode,
      },
      relations: {
        stall: {
          stallClassification: {
            thumbnailFile: true,
          },
        },
        tenantUser: {
          userProfilePic: {
            file: true,
          },
        },
        assignedCollectorUser: {
          userProfilePic: {
            file: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(TENANTRENTCONTRACT_ERROR_NOT_FOUND);
    }
    delete result.tenantUser.password;
    return result;
  }

  async getAllByTenantUserCode(tenantUserCode) {
    const result = await this.tenantRentContractRepo.find({
      where: {
        tenantUser: { userCode: tenantUserCode },
        status: TENANTRENTCONTRACT_STATUS.ACTIVE,
      },
      relations: {
        stall: {
          stallClassification: {
            thumbnailFile: true,
          },
        },
        tenantUser: {
          userProfilePic: {
            file: true,
          },
        },
        assignedCollectorUser: {
          userProfilePic: {
            file: true,
          },
        },
      },
      order: {
        currentDueDate: "ASC",
      },
    });
    const contract: any[] = result.map((x) => {
      delete x.tenantUser.password;
      return x;
    });
    return contract;
  }

  async getAllByCollectorUserCode(collectorUserCode, date: Date) {
    const result = await this.tenantRentContractRepo.find({
      where: {
        assignedCollectorUser: { userCode: collectorUserCode },
        currentDueDate: LessThanOrEqual(moment(date).format("YYYY-MM-DD")),
        status: TENANTRENTCONTRACT_STATUS.ACTIVE,
      },
      relations: {
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
      order: {
        currentDueDate: "ASC",
      },
    });
    const contract: any[] = result.map((x) => {
      delete x.tenantUser.password;
      return x;
    });
    return contract;
  }

  async create(dto: CreateTenantRentContractDto) {
    return await this.tenantRentContractRepo.manager.transaction(
      async (entityManager) => {
        let stall = await entityManager.findOne(Stalls, {
          where: {
            stallCode: dto.stallCode,
            status: STALL_STATUS.AVAILABLE,
          },
        });
        if (!stall) {
          throw Error(STALL_ERROR_NOT_AVAILABLE);
        }
        let tenantRentContract = await entityManager.findOne(
          TenantRentContract,
          {
            where: {
              tenantUser: {
                userCode: dto.tenantUserCode,
              },
              stall: {
                stallCode: stall.stallCode,
              },
              status: TENANTRENTCONTRACT_STATUS.ACTIVE,
            },
            relations: {
              stall: {
                stallClassification: true,
              },
              tenantUser: {
                userProfilePic: {
                  file: true,
                },
              },
            },
          }
        );
        if (tenantRentContract) {
          throw Error("Stall was already rented by tenant");
        }
        tenantRentContract = new TenantRentContract();

        tenantRentContract.stall = stall;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentContract.dateCreated = timestamp;
        const dateStart = moment(
          new Date(dto.dateStart),
          DateConstant.DATE_LANGUAGE
        ).format("YYYY-MM-DD");
        tenantRentContract.dateStart = dateStart;
        //get current due date
        let currentDueDate;
        if (dto.stallRateCode.toString().toUpperCase() === "MONTHLY") {
          const getDateQuery = getNextMonth(dateStart);
          currentDueDate = await entityManager
            .query(getDateQuery)
            .then((res) => {
              return res[0]["nextmonth"];
            });
        } else if (dto.stallRateCode.toString().toUpperCase() === "WEEKLY") {
          const getDateQuery = getNextWeek(dateStart);
          currentDueDate = await entityManager
            .query(getDateQuery)
            .then((res) => {
              return res[0]["nextweek"];
            });
        } else {
          const getDateQuery = getNextDate(dateStart, 1);
          currentDueDate = await entityManager
            .query(getDateQuery)
            .then((res) => {
              return res[0]["nextdate"];
            });
        }
        tenantRentContract.currentDueDate = currentDueDate;
        tenantRentContract.stallRateCode = dto.stallRateCode;
        let stallRentAmount = 0;
        if (dto.stallRateCode === "DAILY") {
          stallRentAmount =
            stall.dailyRate && !isNaN(Number(stall.dailyRate))
              ? Number(stall.dailyRate)
              : 0;
        } else if (dto.stallRateCode === "WEEKLY") {
          stallRentAmount =
            stall.weeklyRate && !isNaN(Number(stall.weeklyRate))
              ? Number(stall.weeklyRate)
              : 0;
        } else {
          stallRentAmount =
            stall.monthlyRate && !isNaN(Number(stall.monthlyRate))
              ? Number(stall.monthlyRate)
              : 0;
        }

        tenantRentContract.stallRentAmount = Number(stallRentAmount).toFixed(2);
        tenantRentContract.otherCharges = Number(dto.otherCharges).toFixed(2);
        const totalRentAmount =
          Number(stallRentAmount) + Number(dto.otherCharges);
        tenantRentContract.totalRentAmount = totalRentAmount.toFixed(2);
        tenantRentContract.status = TENANTRENTCONTRACT_STATUS.ACTIVE;

        const tenantUser = await entityManager.findOne(Users, {
          where: {
            userCode: dto.tenantUserCode,
            userType: USER_TYPE.TENANT,
          },
        });
        if (!tenantUser) {
          throw Error("Tenant " + USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentContract.tenantUser = tenantUser;

        const assignedCollectorUser = await entityManager.findOne(Users, {
          where: {
            userCode: dto.assignedCollectorUserCode,
            userType: USER_TYPE.COLLECTOR,
          },
        });
        if (!assignedCollectorUser) {
          throw Error("Collector " + USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentContract.assignedCollectorUser = assignedCollectorUser;

        tenantRentContract = await entityManager.save(tenantRentContract);
        tenantRentContract.tenantRentContractCode = generateIndentityCode(
          tenantRentContract.tenantRentContractId
        );
        tenantRentContract = await entityManager.save(
          TenantRentContract,
          tenantRentContract
        );
        stall.status = STALL_STATUS.OCCUPIED;
        stall = await entityManager.save(Stalls, stall);

        tenantRentContract = await entityManager.findOne(TenantRentContract, {
          where: {
            tenantRentContractCode: tenantRentContract.tenantRentContractCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            tenantUser: {
              userProfilePic: {
                file: true,
              },
            },
          },
        });
        delete tenantRentContract.tenantUser.password;
        return tenantRentContract;
      }
    );
  }

  async createFromBooking(dto: CreateTenantRentContracFromBookingtDto) {
    return await this.tenantRentContractRepo.manager.transaction(
      async (entityManager) => {
        let tenantRentBooking = await entityManager.findOne(TenantRentBooking, {
          where: {
            tenantRentBookingCode: dto.tenantRentBookingCode,
            requestedByUser: {
              userCode: dto.tenantUserCode,
            },
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
        if (!tenantRentBooking) {
          throw Error(TENANTRENTBOOKING_ERROR_NOT_FOUND);
        }
        if (
          tenantRentBooking &&
          tenantRentBooking.status !== TENANTRENTBOOKING_STATUS.PENDING
        ) {
          throw Error(
            `Booking was already ${tenantRentBooking.status.toLowerCase()}!`
          );
        }
        let tenantRentContract = await entityManager.findOne(
          TenantRentContract,
          {
            where: {
              tenantUser: {
                userCode: dto.tenantUserCode,
              },
              stall: {
                stallCode: tenantRentBooking.stall.stallCode,
              },
              status: TENANTRENTCONTRACT_STATUS.ACTIVE,
            },
            relations: {
              stall: {
                stallClassification: true,
              },
              tenantUser: {
                userProfilePic: {
                  file: true,
                },
              },
            },
          }
        );
        if (tenantRentContract) {
          throw Error("Stall was already rented by tenant");
        }
        tenantRentContract = new TenantRentContract();

        let stall = await entityManager.findOne(Stalls, {
          where: {
            stallCode: tenantRentBooking.stall.stallCode,
            status: STALL_STATUS.AVAILABLE,
          },
        });
        if (!stall) {
          throw Error(STALL_ERROR_NOT_AVAILABLE);
        }
        tenantRentContract.stall = stall;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentContract.dateCreated = timestamp;
        const dateStart = moment(
          new Date(dto.dateStart),
          DateConstant.DATE_LANGUAGE
        ).format("YYYY-MM-DD");
        tenantRentContract.dateStart = dateStart;
        //get current due date
        let currentDueDate;
        if (dto.stallRateCode.toUpperCase() === "MONTHLY") {
          currentDueDate = await entityManager
            .query(getNextMonth(dateStart))
            .then((res) => {
              return res[0]["nextmonth"];
            });
        } else if (dto.stallRateCode.toUpperCase() === "WEEKLY") {
          currentDueDate = await entityManager
            .query(getNextWeek(dateStart))
            .then((res) => {
              return res[0]["nextweek"];
            });
        } else {
          currentDueDate = await entityManager
            .query(getNextDate(dateStart, 1))
            .then((res) => {
              return res[0]["nextdate"];
            });
        }
        tenantRentContract.currentDueDate = currentDueDate;
        tenantRentContract.stallRateCode = dto.stallRateCode;
        let stallRentAmount = 0;
        if (dto.stallRateCode === "DAILY") {
          stallRentAmount =
            stall.dailyRate && !isNaN(Number(stall.dailyRate))
              ? Number(stall.dailyRate)
              : 0;
        } else if (dto.stallRateCode === "WEEKLY") {
          stallRentAmount =
            stall.weeklyRate && !isNaN(Number(stall.weeklyRate))
              ? Number(stall.weeklyRate)
              : 0;
        } else {
          stallRentAmount =
            stall.monthlyRate && !isNaN(Number(stall.monthlyRate))
              ? Number(stall.monthlyRate)
              : 0;
        }

        tenantRentContract.stallRentAmount = Number(stallRentAmount).toFixed(2);
        tenantRentContract.otherCharges = Number(dto.otherCharges).toFixed(2);
        const totalRentAmount =
          Number(stallRentAmount) + Number(dto.otherCharges);
        tenantRentContract.totalRentAmount = totalRentAmount.toFixed(2);
        tenantRentContract.status = TENANTRENTCONTRACT_STATUS.ACTIVE;

        const tenantUser = await entityManager.findOne(Users, {
          where: {
            userCode: dto.tenantUserCode,
            userType: USER_TYPE.TENANT,
          },
        });
        if (!tenantUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentContract.tenantUser = tenantUser;

        const assignedCollectorUser = await entityManager.findOne(Users, {
          where: {
            userCode: dto.assignedCollectorUserCode,
            userType: USER_TYPE.COLLECTOR,
          },
        });
        if (!assignedCollectorUser) {
          throw Error("Collector " + USER_ERROR_USER_NOT_FOUND);
        }
        tenantRentContract.assignedCollectorUser = assignedCollectorUser;

        tenantRentContract = await entityManager.save(tenantRentContract);
        tenantRentContract.tenantRentContractCode = generateIndentityCode(
          tenantRentContract.tenantRentContractId
        );
        tenantRentContract = await entityManager.save(
          TenantRentContract,
          tenantRentContract
        );
        stall.status = STALL_STATUS.OCCUPIED;
        stall = await entityManager.save(Stalls, stall);
        tenantRentBooking.status = TENANTRENTBOOKING_STATUS.LEASED;
        tenantRentBooking = await entityManager.save(
          TenantRentBooking,
          tenantRentBooking
        );

        tenantRentContract = await entityManager.findOne(TenantRentContract, {
          where: {
            tenantRentContractCode: tenantRentContract.tenantRentContractCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            tenantUser: {
              userProfilePic: {
                file: true,
              },
            },
          },
        });
        delete tenantRentContract.tenantUser.password;
        return tenantRentContract;
      }
    );
  }

  async updateStatus(
    tenantRentContractCode,
    dto: UpdateTenantRentContractStatusDto
  ) {
    return await this.tenantRentContractRepo.manager.transaction(
      async (entityManager) => {
        let tenantRentContract = await entityManager.findOne(
          TenantRentContract,
          {
            where: {
              tenantRentContractCode,
            },
            relations: {
              stall: {
                stallClassification: true,
              },
              tenantUser: {
                userProfilePic: {
                  file: true,
                },
              },
            },
          }
        );
        if (!tenantRentContract) {
          throw Error(TENANTRENTCONTRACT_ERROR_NOT_FOUND);
        }
        if (tenantRentContract.status !== TENANTRENTCONTRACT_STATUS.ACTIVE) {
          throw Error(
            "The contract was already in the state of: " +
              tenantRentContract.status.toLocaleLowerCase()
          );
        }
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        tenantRentContract.dateLastUpdated = timestamp;
        tenantRentContract.status = dto.status;
        tenantRentContract = await entityManager.save(
          TenantRentContract,
          tenantRentContract
        );
        let stall = await entityManager.findOne(Stalls, {
          where: {
            stallCode: tenantRentContract.stall.stallCode,
          },
        });
        if (!stall) {
          throw Error(STALL_ERROR_NOT_AVAILABLE);
        }
        stall.status = STALL_STATUS.AVAILABLE;
        stall = await entityManager.save(Stalls, stall);
        tenantRentContract = await entityManager.findOne(TenantRentContract, {
          where: {
            tenantRentContractCode,
          },
          relations: {
            stall: {
              stallClassification: true,
            },
            tenantUser: {
              userProfilePic: {
                file: true,
              },
            },
          },
        });
        delete tenantRentContract.tenantUser.password;
        return tenantRentContract;
      }
    );
  }
}
