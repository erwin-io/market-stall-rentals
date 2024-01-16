import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultStallDto } from "./stall-base.dto";

export class UpdateStallDto extends DefaultStallDto {}

export class UpdateStallStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["AVAILABLE", "OCCUPIED", "UPCOMING", "INMAINTENANCE", "UNAVAILABLE"])
  @IsUppercase()
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "UPCOMING"
    | "INMAINTENANCE"
    | "UNAVAILABLE";
}
