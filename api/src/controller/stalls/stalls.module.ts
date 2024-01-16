import { Module } from "@nestjs/common";
import { StallController } from "./stalls.controller";
import { Stalls } from "src/db/entities/Stalls";
import { StallsService } from "src/services/stalls.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Stalls])],
  controllers: [StallController],
  providers: [StallsService],
  exports: [StallsService],
})
export class StallModule {}
