import { Module } from "@nestjs/common";
import { TenantRentContractController } from "./tenant-rent-contract.controller";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { TenantRentContractService } from "src/services/tenant-rent-contract.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([TenantRentContract])],
  controllers: [TenantRentContractController],
  providers: [TenantRentContractService],
  exports: [TenantRentContractService],
})
export class TenantRentContractModule {}
