import { Module } from "@nestjs/common";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { ContractPaymentService } from "src/services/contract-payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractPaymentController } from "./contract-payment.controller";
import { PusherService } from "src/services/pusher.service";
import { HttpModule } from "@nestjs/axios";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ContractPayment])],
  controllers: [ContractPaymentController],
  providers: [
    ContractPaymentService,
    PusherService,
    OneSignalNotificationService,
  ],
  exports: [
    ContractPaymentService,
    PusherService,
    OneSignalNotificationService,
  ],
})
export class ContractPaymentModule {}
