import { TenantRentContract } from "./TenantRentContract";
import { Users } from "./Users";
export declare class ContractPayment {
    contractPaymentId: string;
    contractPaymentCode: string | null;
    dateCreated: Date;
    datePaid: Date;
    totalDueAmount: string;
    paymentAmount: string;
    status: string;
    overDueAmount: string;
    tenantRentContract: TenantRentContract;
    user: Users;
}
