import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultContractPaymentDto } from "./contract-payment-base.dto";

export class UpdateContractPaymentStatusDto extends DefaultContractPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["VOID"])
  @IsUppercase()
  status: "VOID";
}
