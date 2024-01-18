import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultTenantRentContractDto } from "./tenant-rent-contract-base.dto";

export class UpdateTenantRentContractDto extends DefaultTenantRentContractDto {}

export class UpdateTenantRentContractStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["CLOSED", "CANCELLED"])
  @IsUppercase()
  status: "CLOSED" | "CANCELLED";
}
