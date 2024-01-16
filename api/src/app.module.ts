import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { UsersModule } from "./controller/users/users.module";
import { AccessModule } from "./controller/access/access.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { NotificationsModule } from "./controller/notifications/notifications.module";
import { StallModule } from "./controller/stalls/stalls.module";
import { StallClassificationsModule } from "./controller/stall-classifications/stall-classifications.module";
import { TenantRentBookingService } from "./services/tenant-rent-booking.service";
import { TenantRentBookingModule } from "./controller/tenant-rent-booking/tenant-rent-booking.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    AccessModule,
    NotificationsModule,
    FirebaseProviderModule,
    StallModule,
    StallClassificationsModule,
    TenantRentBookingModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
