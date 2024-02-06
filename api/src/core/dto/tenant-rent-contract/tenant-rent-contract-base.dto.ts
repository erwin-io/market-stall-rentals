import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class DefaultTenantRentContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  dateStart: Date;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  otherCharges: number;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Tenant is required!"
  })
  tenantUserCode: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Collector is required!"
  })
  assignedCollectorUserCode: string;
}