import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultTenantRentBookingDto } from "./tenant-rent-booking-base.dto";

export class UpdateTenantRentBookingDto extends DefaultTenantRentBookingDto {}

export class UpdateTenantRentBookingStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["REJECTED", "PROCESSING", "LEASED", "CANCELLED"])
  @IsUppercase()
  status: "REJECTED" | "PROCESSING" | "LEASED" | "CANCELLED";
}
