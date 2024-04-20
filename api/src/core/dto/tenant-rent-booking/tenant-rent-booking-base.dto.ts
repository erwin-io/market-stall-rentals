import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  Matches,
} from "class-validator";

export class DefaultTenantRentBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  stallCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  datePreferedStart: Date;
  
}
