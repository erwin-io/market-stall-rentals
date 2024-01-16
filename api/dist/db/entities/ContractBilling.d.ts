import { Users } from "./Users";
import { TenantRentContract } from "./TenantRentContract";
import { ContractPayment } from "./ContractPayment";
export declare class ContractBilling {
    contractBillingId: string;
    contractBillingCode: string | null;
    name: string;
    dateCreated: Date;
    dateBilled: Date;
    billAmount: string;
    otherCharges: string;
    totalBillAmount: string;
    paymentAmount: string;
    status: string;
    assignedCollector: Users;
    tenantRentContract: TenantRentContract;
    user: Users;
    contractPayments: ContractPayment[];
}
