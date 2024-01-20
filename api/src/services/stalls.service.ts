import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { STALLCLASSIFICATION_ERROR_NOT_FOUND } from "src/common/constant/stall-classifications.constant";
import {
  STALL_ERROR_NOT_FOUND,
  STALL_STATUS,
} from "src/common/constant/stalls.constant";
import { TENANTRENTCONTRACT_STATUS } from "src/common/constant/tenant-rent-contract.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateStallDto } from "src/core/dto/stalls/stall.create.dto";
import {
  UpdateStallDto,
  UpdateStallStatusDto,
} from "src/core/dto/stalls/stall.update.dto";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { Stalls } from "src/db/entities/Stalls";
import { Repository } from "typeorm";

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stalls)
    private readonly stallRepo: Repository<Stalls>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.stallRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          stallClassification: {
            thumbnailFile: true,
          },
        },
      }),
      this.stallRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getById(stallId) {
    const result = await this.stallRepo.findOne({
      where: {
        stallId,
        active: true,
      },
      relations: {
        stallClassification: {
          thumbnailFile: true,
        },
      },
    });
    if (!result) {
      throw Error(STALL_ERROR_NOT_FOUND);
    }
    return result;
  }

  async getByCode(stallCode = "") {
    const result = await this.stallRepo.findOne({
      where: {
        stallCode: stallCode?.toString()?.toLowerCase(),
        active: true,
      },
      relations: {
        stallClassification: {
          thumbnailFile: true,
        },
      },
    });
    if (!result) {
      throw Error(STALL_ERROR_NOT_FOUND);
    }
    return result;
  }

  async getAllByTenantUserCode(tenantUserCode = "") {
    const result = await this.stallRepo.find({
      where: {
        tenantRentContracts: {
          tenantUser: {
            userCode: tenantUserCode,
          },
          status: TENANTRENTCONTRACT_STATUS.ACTIVE,
        },
      },
      relations: {
        stallClassification: {
          thumbnailFile: true,
        },
      },
    });
    if (!result) {
      throw Error(STALL_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateStallDto) {
    try {
      return await this.stallRepo.manager.transaction(async (entityManager) => {
        let stall = new Stalls();
        stall.stallCode = dto.stallCode.toLowerCase();
        stall.name = dto.name;
        stall.areaName = dto.areaName;
        stall.status = STALL_STATUS.AVAILABLE;
        stall.monthlyRate = dto.monthlyRate ? dto.monthlyRate.toString() : "0";
        stall.weeklyRate = dto.weeklyRate ? dto.weeklyRate.toString() : "0";
        stall.dailyRate = dto.dailyRate ? dto.dailyRate.toString() : "0";

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        stall.dateAdded = timestamp;
        const stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationId: dto.stallClassificationId,
            },
          }
        );
        if (!stallClassification) {
          throw Error(STALLCLASSIFICATION_ERROR_NOT_FOUND);
        }
        stall.stallClassification = stallClassification;
        stall = await entityManager.save(stall);

        return await entityManager.findOne(Stalls, {
          where: {
            stallId: stall.stallId,
          },
          relations: {
            stallClassification: {
              thumbnailFile: true,
            },
          },
        });
      });
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_stall")
      ) {
        throw Error("Stall name already exist!");
      } else if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_stallcode")
      ) {
        throw Error("Stall code already exist!");
      } else {
        throw ex;
      }
    }
  }

  async update(stallId, dto: UpdateStallDto) {
    try {
      return await this.stallRepo.manager.transaction(async (entityManager) => {
        let stall = await entityManager.findOne(Stalls, {
          where: {
            stallId,
            active: true,
          },
          relations: {
            stallClassification: true,
          },
        });
        if (!stall) {
          throw Error(STALL_ERROR_NOT_FOUND);
        }

        stall.stallCode = dto.stallCode.toLowerCase();
        stall.name = dto.name;
        stall.areaName = dto.areaName;
        stall.monthlyRate = dto.monthlyRate ? dto.monthlyRate.toString() : "0";
        stall.weeklyRate = dto.weeklyRate ? dto.weeklyRate.toString() : "0";
        stall.dailyRate = dto.dailyRate ? dto.dailyRate.toString() : "0";

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        stall.dateLastUpdated = timestamp;
        const stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationId: dto.stallClassificationId,
            },
          }
        );
        if (!stallClassification) {
          throw Error(STALLCLASSIFICATION_ERROR_NOT_FOUND);
        }
        stall.stallClassification = stallClassification;
        stall = await entityManager.save(Stalls, stall);
        return await entityManager.findOne(Stalls, {
          where: {
            stallId,
            active: true,
          },
          relations: {
            stallClassification: {
              thumbnailFile: true,
            },
          },
        });
      });
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_stall")
      ) {
        throw Error("Stall name already exist!");
      } else if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_stallcode")
      ) {
        throw Error("Stall code already exist!");
      } else {
        throw ex;
      }
    }
  }

  async updateStatus(stallId, dto: UpdateStallStatusDto) {
    return await this.stallRepo.manager.transaction(async (entityManager) => {
      let stall = await entityManager.findOne(Stalls, {
        where: {
          stallId,
          active: true,
        },
        relations: {
          stallClassification: true,
        },
      });
      if (!stall) {
        throw Error(STALL_ERROR_NOT_FOUND);
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      stall.dateLastUpdated = timestamp;
      stall.status = dto.status;
      stall = await entityManager.save(Stalls, stall);
      return await entityManager.findOne(Stalls, {
        where: {
          stallId,
          active: true,
        },
        relations: {
          stallClassification: {
            thumbnailFile: true,
          },
        },
      });
    });
  }

  async delete(stallId) {
    return await this.stallRepo.manager.transaction(async (entityManager) => {
      const stall = await entityManager.findOne(Stalls, {
        where: {
          stallId,
          active: true,
        },
        relations: {
          stallClassification: true,
        },
      });
      if (!stall) {
        throw Error(STALL_ERROR_NOT_FOUND);
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      stall.dateLastUpdated = timestamp;
      stall.active = false;
      return await entityManager.save(Stalls, stall);
    });
  }
}
