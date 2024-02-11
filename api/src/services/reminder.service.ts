import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { LessThan, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Users } from "src/db/entities/Users";
import { Notifications } from "src/db/entities/Notifications";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
import { TENANTRENTBOOKING_STATUS } from "src/common/constant/tenant-rent-booking.constant";
import { TENANTRENTCONTRACT_STATUS } from "src/common/constant/tenant-rent-contract.constant";

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,
    private pusherService: PusherService,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async sendDueReminder({ date }) {
    try {
      return await this.notificationsRepo.manager.transaction(
        async (entityManager) => {
          const dateFilter = moment(
            new Date(date),
            DateConstant.DATE_LANGUAGE
          ).format();
          const [dueToday, overDue] = await Promise.all([
            entityManager.find(TenantRentContract, {
              where: {
                currentDueDate: moment(new Date(dateFilter)).format(
                  "YYYY-MM-DD"
                ),
                status: TENANTRENTCONTRACT_STATUS.ACTIVE,
              },
              relations: {
                tenantUser: true,
                stall: {
                  stallClassification: true,
                },
              },
            }),
            entityManager.find(TenantRentContract, {
              where: {
                currentDueDate: LessThan(
                  moment(new Date(dateFilter)).format("YYYY-MM-DD hh:mm:ss")
                ),
                status: TENANTRENTCONTRACT_STATUS.ACTIVE,
              },
              relations: {
                tenantUser: true,
                stall: {
                  stallClassification: true,
                },
              },
            }),
          ]);
          
          return [...dueToday, ...overDue];
        }
      );
    } catch (ex) {
      throw ex;
    }
  }
  async test({ userId, title, description }) {
    try {
      const user = await this.notificationsRepo.manager.findOne(Users, {
        where: {
          userId,
        },
      });
      this.oneSignalNotificationService.sendToExternalUser(
        user.userName,
        {},
        {},
        [],
        title,
        description
      );
      this.pusherService.sendNotif([userId], title, description);
    } catch (ex) {
      throw ex;
    }
  }
}
