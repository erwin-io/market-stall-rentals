import { DefaultTenantRentBookingDto } from "./tenant-rent-booking-base.dto";
export declare class UpdateTenantRentBookingDto extends DefaultTenantRentBookingDto {
}
export declare class UpdateTenantRentBookingStatusDto {
    status: "REJECTED" | "PROCESSING" | "LEASED" | "CANCELLED";
}
