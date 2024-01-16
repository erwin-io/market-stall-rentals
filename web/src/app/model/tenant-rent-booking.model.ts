import { Stalls } from './stalls.model';
import { Users } from './users';
export class TenantRentBooking {
  tenantRentBookingId: string;
  tenantRentBookingCode: string;
  dateCreated: Date;
  dateLastUpdated: Date;
  datePreferedStart: string;
  status: string;
  stall: Stalls;
  user: Users;
  requestedBy: string;
}
