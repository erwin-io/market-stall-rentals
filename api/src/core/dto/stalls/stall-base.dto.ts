import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsUppercase,
  Matches,
  ValidateNested,
} from "class-validator";

export class DefaultStallDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\S*$/)
  stallCode: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  areaName: string;

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
  monthlyRate: number;

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
  weeklyRate: number;

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
  dailyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  stallClassificationId: string;
}
