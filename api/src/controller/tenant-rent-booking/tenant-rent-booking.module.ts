import { Module } from "@nestjs/common";
import { TenantRentBookingController } from "./tenant-rent-booking.controller";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentBookingService } from "src/services/tenant-rent-booking.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([TenantRentBooking])],
  controllers: [TenantRentBookingController],
  providers: [TenantRentBookingService],
  exports: [TenantRentBookingService],
})
export class TenantRentBookingModule {}
