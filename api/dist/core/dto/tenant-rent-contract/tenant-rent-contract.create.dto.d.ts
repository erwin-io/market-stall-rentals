import { DefaultTenantRentContractDto } from "./tenant-rent-contract-base.dto";
export declare class CreateTenantRentContractDto extends DefaultTenantRentContractDto {
    stallCode: string;
    stallRateCode: "DAILY" | "WEEKLY" | "MONTHLY";
}
export declare class CreateTenantRentContracFromBookingtDto extends DefaultTenantRentContractDto {
    tenantRentBookingCode: string;
    stallRateCode: "DAILY" | "WEEKLY" | "MONTHLY";
}
