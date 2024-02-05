import { Module } from "@nestjs/common";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { ContractPaymentService } from "src/services/contract-payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractPaymentController } from "./contract-payment.controller";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractPayment])],
  controllers: [ContractPaymentController],
  providers: [ContractPaymentService, PusherService],
  exports: [ContractPaymentService, PusherService],
})
export class ContractPaymentModule {}
