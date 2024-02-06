import { ContractPayment } from "./ContractPayment";
import { GatewayConnectedUsers } from "./GatewayConnectedUsers";
import { Notifications } from "./Notifications";
import { TenantRentBooking } from "./TenantRentBooking";
import { TenantRentContract } from "./TenantRentContract";
import { UserProfilePic } from "./UserProfilePic";
import { Access } from "./Access";
export declare class Users {
    userId: string;
    userName: string;
    password: string;
    fullName: string;
    gender: string;
    birthDate: string;
    mobileNumber: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string | null;
    address: string;
    userType: string;
    contractPayments: ContractPayment[];
    gatewayConnectedUsers: GatewayConnectedUsers[];
    notifications: Notifications[];
    tenantRentBookings: TenantRentBooking[];
    tenantRentContracts: TenantRentContract[];
    tenantRentContracts2: TenantRentContract[];
    userProfilePic: UserProfilePic;
    access: Access;
}
