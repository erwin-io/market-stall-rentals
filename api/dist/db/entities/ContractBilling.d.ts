import { Users } from "./Users";
import { TenantRentContract } from "./TenantRentContract";
export declare class ContractBilling {
    contractBillingId: string;
    contractBillingCode: string | null;
    name: string;
    dateCreated: string;
    dueDate: string;
    billAmount: string;
    otherCharges: string;
    totalBillAmount: string;
    paymentAmount: string;
    status: string;
    assignedCollector: Users;
    tenantRentContract: TenantRentContract;
    user: Users;
}
