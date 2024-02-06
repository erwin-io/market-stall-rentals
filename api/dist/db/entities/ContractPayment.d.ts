import { TenantRentContract } from "./TenantRentContract";
import { Users } from "./Users";
export declare class ContractPayment {
    contractPaymentId: string;
    contractPaymentCode: string | null;
    referenceNumber: string;
    dateCreated: Date;
    datePaid: string;
    dueDateStart: string;
    dueDateEnd: string;
    dueAmount: string;
    overDueAmount: string;
    totalDueAmount: string;
    paymentAmount: string;
    status: string;
    tenantRentContract: TenantRentContract;
    user: Users;
}
