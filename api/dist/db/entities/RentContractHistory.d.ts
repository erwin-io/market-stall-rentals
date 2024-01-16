import { TenantRentContract } from "./TenantRentContract";
export declare class RentContractHistory {
    rentContractHistoryId: string;
    dateChanged: Date;
    date: Date;
    dateRenew: Date;
    stallRentAmount: string;
    otherCharges: string;
    totalRentAmount: string;
    status: string;
    renewStatus: string;
    tenantRentContract: TenantRentContract;
}
