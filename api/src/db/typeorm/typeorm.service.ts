import { Users } from "../entities/Users";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { Access } from "../entities/Access";
import { Notifications } from "../entities/Notifications";
import { GatewayConnectedUsers } from "../entities/GatewayConnectedUsers";
import { StallClassifications } from "../entities/StallClassifications";
import { Stalls } from "../entities/Stalls";
import { UserProfilePic } from "../entities/UserProfilePic";
import { Files } from "../entities/Files";
import { TenantRentBooking } from "../entities/TenantRentBooking";
import { TenantRentContract } from "../entities/TenantRentContract";
import { RentContractHistory } from "../entities/RentContractHistory";
import { ContractBilling } from "../entities/ContractBilling";
import { ContractPayment } from "../entities/ContractPayment";
import { StallRate } from "../entities/StallRate";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const ssl = this.config.get<string>("SSL");
    const config: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users, 
        UserProfilePic,
        Files,
        Access, 
        Notifications, 
        GatewayConnectedUsers,
        StallClassifications,
        Stalls,
        TenantRentBooking,
        TenantRentContract,
        RentContractHistory,
        ContractBilling,
        ContractPayment,
        StallRate,
        ContractPayment,
      ],
      synchronize: false, // never use TRUE in production!
      ssl: ssl.toLocaleLowerCase().includes("true"),
      extra: {},
    };
    if (config.ssl) {
      config.extra.ssl = {
        require: true,
        rejectUnauthorized: false,
      };
    }
    return config;
  }
}
