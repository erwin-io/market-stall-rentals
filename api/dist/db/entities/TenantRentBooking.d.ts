import { Users } from "./Users";
import { Stalls } from "./Stalls";
export declare class TenantRentBooking {
    tenantRentBookingId: string;
    tenantRentBookingCode: string | null;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    datePreferedStart: string;
    status: string;
    requestedByUser: Users;
    stall: Stalls;
}
