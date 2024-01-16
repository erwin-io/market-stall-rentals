import { ContractBilling } from "./ContractBilling";
import { Users } from "./Users";
export declare class ContractPayment {
    contractPaymentId: string;
    contractPaymentCode: string | null;
    dateCreated: Date;
    datePaid: Date;
    totalBillAmount: string;
    paymentAmount: string;
    status: string;
    contractBilling: ContractBilling;
    user: Users;
}
