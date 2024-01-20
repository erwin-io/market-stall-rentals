import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { STALLCLASSIFICATION_ERROR_NOT_FOUND } from "src/common/constant/stall-classifications.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.create.dto";
import { UpdateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.update.dto";
import { Files } from "src/db/entities/Files";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import moment from "moment";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { UserProfilePic } from "src/db/entities/UserProfilePic";

@Injectable()
export class StallClassificationsService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(StallClassifications)
    private readonly stallClassificationRepo: Repository<StallClassifications>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.stallClassificationRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {
          thumbnailFile: true,
        },
        skip,
        take,
        order,
      }),
      this.stallClassificationRepo.count({
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

  async getAll() {
    return this.stallClassificationRepo.find({
      where: {
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
  }

  async getByCode(stallClassificationsCode) {
    const result = await this.stallClassificationRepo.findOne({
      where: {
        stallClassificationsCode,
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(STALLCLASSIFICATION_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateStallClassificationDto) {
    return await this.stallClassificationRepo.manager.transaction(
      async (entityManager) => {
        let stallClassification = new StallClassifications();
        stallClassification.name = dto.name;
        stallClassification.location = dto.location;
        stallClassification = await entityManager.save(stallClassification);
        stallClassification.stallClassificationsCode = generateIndentityCode(
          stallClassification.stallClassificationId
        );

        if (dto.thumbnailFile) {
          const bucket = this.firebaseProvoder.app.storage().bucket();
          stallClassification.thumbnailFile = new Files();
          const newFileName: string = uuid();
          stallClassification.thumbnailFile.fileName = `${newFileName}${extname(
            dto.thumbnailFile.fileName
          )}`;
          const bucketFile = bucket.file(
            `stall-classifications/${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`
          );
          const img = Buffer.from(dto.thumbnailFile.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            stallClassification.thumbnailFile.url = url[0];
            stallClassification.thumbnailFile = await entityManager.save(
              Files,
              stallClassification.thumbnailFile
            );
          });
        }

        stallClassification = await entityManager.save(
          StallClassifications,
          stallClassification
        );
        stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationId: stallClassification.stallClassificationId,
            },
            relations: {
              thumbnailFile: true,
            },
          }
        );
        return stallClassification;
      }
    );
  }

  async update(stallClassificationsCode, dto: UpdateStallClassificationDto) {
    return await this.stallClassificationRepo.manager.transaction(
      async (entityManager) => {
        let stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationsCode,
              active: true,
            },
            relations: {
              thumbnailFile: true,
            },
          }
        );
        if (!stallClassification) {
          throw Error(STALLCLASSIFICATION_ERROR_NOT_FOUND);
        }
        stallClassification.name = dto.name;
        stallClassification.location = dto.location;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        stallClassification.dateAdded = timestamp;

        if (dto.thumbnailFile) {
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();
          if (stallClassification.thumbnailFile) {
            try {
              const deleteFile = bucket.file(
                `stall-classifications/${stallClassification.thumbnailFile.fileName}`
              );
              deleteFile.delete();
            } catch (ex) {
              console.log(ex);
            }
            const file = stallClassification.thumbnailFile;
            file.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;

            const bucketFile = bucket.file(
              `stall-classifications/${newFileName}${extname(
                dto.thumbnailFile.fileName
              )}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async (res) => {
              console.log("res");
              console.log(res);
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });

              file.url = url[0];
              stallClassification.thumbnailFile = await entityManager.save(
                Files,
                file
              );
            });
          } else {
            stallClassification.thumbnailFile = new Files();
            stallClassification.thumbnailFile.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;
            const bucketFile = bucket.file(
              `stall-classifications/${newFileName}${extname(
                dto.thumbnailFile.fileName
              )}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              stallClassification.thumbnailFile.url = url[0];
              stallClassification.thumbnailFile = await entityManager.save(
                Files,
                stallClassification.thumbnailFile
              );
            });
          }
        }

        stallClassification = await entityManager.save(
          StallClassifications,
          stallClassification
        );

        stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationId: stallClassification.stallClassificationId,
            },
            relations: {
              thumbnailFile: true,
            },
          }
        );
        return stallClassification;
      }
    );
  }

  async delete(stallClassificationsCode) {
    return await this.stallClassificationRepo.manager.transaction(
      async (entityManager) => {
        const stallClassification = await entityManager.findOne(
          StallClassifications,
          {
            where: {
              stallClassificationsCode,
              active: true,
            },
          }
        );
        if (!stallClassification) {
          throw Error(STALLCLASSIFICATION_ERROR_NOT_FOUND);
        }
        stallClassification.active = false;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        stallClassification.dateLastUpdated = timestamp;
        return await entityManager.save(
          StallClassifications,
          stallClassification
        );
      }
    );
  }
}
