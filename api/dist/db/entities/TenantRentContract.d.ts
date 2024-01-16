import { ContractBilling } from "./ContractBilling";
import { RentContractHistory } from "./RentContractHistory";
import { Stalls } from "./Stalls";
import { Users } from "./Users";
export declare class TenantRentContract {
    tenantRentContractId: string;
    tenantRentContractCode: string | null;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    dateStart: Date;
    dateRenew: Date | null;
    stallRentAmount: string;
    otherCharges: string;
    totalRentAmount: string;
    status: string;
    renewStatus: string | null;
    contractBillings: ContractBilling[];
    rentContractHistories: RentContractHistory[];
    stall: Stalls;
    user: Users;
}
