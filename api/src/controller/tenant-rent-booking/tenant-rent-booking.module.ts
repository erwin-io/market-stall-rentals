import { Module } from "@nestjs/common";
import { TenantRentBookingController } from "./tenant-rent-booking.controller";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentBookingService } from "src/services/tenant-rent-booking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([TenantRentBooking]),
  ],
  controllers: [TenantRentBookingController],
  providers: [
    TenantRentBookingService,
    PusherService,
    OneSignalNotificationService,
  ],
  exports: [
    TenantRentBookingService,
    PusherService,
    OneSignalNotificationService,
  ],
})
export class TenantRentBookingModule {}
