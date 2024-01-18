import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsUppercase } from "class-validator";
import { DefaultTenantRentContractDto } from "./tenant-rent-contract-base.dto";

export class CreateTenantRentContractDto extends DefaultTenantRentContractDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Stall is required!"
  })
  stallCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["DAILY", "WEEKLY", "MONTHLY"])
  @IsUppercase()
  stallRateCode: "DAILY" | "WEEKLY" | "MONTHLY";
}
export class CreateTenantRentContracFromBookingtDto extends DefaultTenantRentContractDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantRentBookingCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["DAILY", "WEEKLY", "MONTHLY"])
  @IsUppercase()
  stallRateCode: "DAILY" | "WEEKLY" | "MONTHLY";
}
