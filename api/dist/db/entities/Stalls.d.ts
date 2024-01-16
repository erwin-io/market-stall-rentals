import { StallClassifications } from "./StallClassifications";
import { TenantRentBooking } from "./TenantRentBooking";
import { TenantRentContract } from "./TenantRentContract";
export declare class Stalls {
    stallId: string;
    stallCode: string | null;
    name: string;
    areaName: string;
    stallRentAmount: string;
    status: string;
    active: boolean;
    dateAdded: Date;
    dateLastUpdated: Date | null;
    stallClassification: StallClassifications;
    tenantRentBookings: TenantRentBooking[];
    tenantRentContracts: TenantRentContract[];
}
