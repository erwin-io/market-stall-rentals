import { Transform } from "class-transformer";
import { DefaultTenantRentBookingDto } from "./tenant-rent-booking-base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateTenantRentBookingDto extends DefaultTenantRentBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  userCode: string;
}
