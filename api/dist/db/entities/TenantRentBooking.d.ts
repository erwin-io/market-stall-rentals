import { Stalls } from "./Stalls";
import { Users } from "./Users";
export declare class TenantRentBooking {
    tenantRentBookingId: string;
    tenantRentBookingCode: string | null;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    datePreferedStart: string;
    status: string;
    stall: Stalls;
    user: Users;
}
