import { DefaultTenantRentContractDto } from "./tenant-rent-contract-base.dto";
export declare class UpdateTenantRentContractDto extends DefaultTenantRentContractDto {
}
export declare class UpdateTenantRentContractStatusDto {
    status: "CLOSED" | "CANCELLED";
}
