import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumberString, Matches } from "class-validator";

export class DefaultStallDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\S*$/)
  stallCode: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

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
  stallRentAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  areaName: string;

  @ApiProperty()
  @IsNotEmpty()
  stallClassificationId: string;
}
