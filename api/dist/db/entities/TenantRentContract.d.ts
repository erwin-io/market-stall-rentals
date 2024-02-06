import { ContractPayment } from "./ContractPayment";
import { RentContractHistory } from "./RentContractHistory";
import { Users } from "./Users";
import { Stalls } from "./Stalls";
export declare class TenantRentContract {
    tenantRentContractId: string;
    tenantRentContractCode: string | null;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    dateStart: string;
    dateRenew: Date | null;
    stallRentAmount: string;
    otherCharges: string;
    totalRentAmount: string;
    status: string;
    renewStatus: string | null;
    stallRateCode: string;
    currentDueDate: string;
    contractPayments: ContractPayment[];
    rentContractHistories: RentContractHistory[];
    assignedCollectorUser: Users;
    stall: Stalls;
    tenantUser: Users;
}
