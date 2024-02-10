import { Module } from "@nestjs/common";
import { TenantRentContractController } from "./tenant-rent-contract.controller";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { TenantRentContractService } from "src/services/tenant-rent-contract.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([TenantRentContract]),
  ],
  controllers: [TenantRentContractController],
  providers: [
    TenantRentContractService,
    PusherService,
    OneSignalNotificationService,
  ],
  exports: [
    TenantRentContractService,
    PusherService,
    OneSignalNotificationService,
  ],
})
export class TenantRentContractModule {}
