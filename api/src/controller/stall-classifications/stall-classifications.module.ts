import { Module } from "@nestjs/common";
import { StallClassificationsController } from "./stall-classifications.controller";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { StallClassificationsService } from "src/services/stall-classifications.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [
    FirebaseProviderModule,
    TypeOrmModule.forFeature([StallClassifications]),
  ],
  controllers: [StallClassificationsController],
  providers: [StallClassificationsService],
  exports: [StallClassificationsService],
})
export class StallClassificationsModule {}
