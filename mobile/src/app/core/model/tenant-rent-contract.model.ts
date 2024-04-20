import { Stalls } from './stalls.model';
import { Users } from './users';
export class TenantRentContract {
  tenantRentContractId: string;
  tenantRentContractCode: string;
  dateCreated: Date;
  dateLastUpdated: Date;
  dateStart: string;
  dateRenew: Date;
  stallRentAmount: string;
  otherCharges: string;
  totalRentAmount: string;
  status: string;
  renewStatus: string;
  stall: Stalls;
  tenantUser: Users;
  stallRateCode: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  currentDueDate: string;
  assignedCollectorUser: Users;
}
