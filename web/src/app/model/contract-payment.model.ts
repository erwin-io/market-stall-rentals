import { TenantRentContract } from './tenant-rent-contract.model';
import { Users } from './users';

export class ContractPayment {
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
