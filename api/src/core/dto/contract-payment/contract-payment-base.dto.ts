import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsUppercase,
  Matches,
  ValidateNested,
} from "class-validator";

export class DefaultContractPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  paidByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  tenantRentContractCode: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  datePaid: Date;

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
  totalDueAmount: number;

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
  overDueAmount: number;
}
