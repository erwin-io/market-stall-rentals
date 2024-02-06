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
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { DateConstant } from "src/common/constant/date.constant";
import moment from "moment";

@Injectable()
export class ContractPaymentService {
  constructor(
    @InjectRepository(ContractPayment)
    private readonly contractPaymentRepo: Repository<ContractPayment>,
    private pusherService: PusherService
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
          contractPayment.datePaid = moment(dto.datePaid).format("YYYY-MM-DD");
          contractPayment.dueDateStart = moment(dto.dueDateStart).format(
            "YYYY-MM-DD"
          );
          contractPayment.dueDateEnd = moment(dto.dueDateEnd).format(
            "YYYY-MM-DD"
          );
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
}
