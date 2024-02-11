import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Users } from "src/db/entities/Users";
import { RegisterTenantUserDto } from "src/core/dto/auth/register.dto";
import { NotificationsService } from "./notifications.service";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private notificationService;
    constructor(userRepo: Repository<Users>, jwtService: JwtService, notificationService: NotificationsService);
    registerTenant(dto: RegisterTenantUserDto): Promise<Users>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getStaffByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<{
        totalUnreadNotif: number;
        userId: string;
        userName: string;
        password: string;
        fullName: string;
        gender: string;
        birthDate: string;
        mobileNumber: string;
        accessGranted: boolean;
        active: boolean;
        userCode: string;
        address: string;
        userType: string;
        contractPayments: import("../db/entities/ContractPayment").ContractPayment[];
        gatewayConnectedUsers: import("../db/entities/GatewayConnectedUsers").GatewayConnectedUsers[];
        notifications: import("../db/entities/Notifications").Notifications[];
        tenantRentBookings: import("../db/entities/TenantRentBooking").TenantRentBooking[];
        tenantRentContracts: import("../db/entities/TenantRentContract").TenantRentContract[];
        tenantRentContracts2: import("../db/entities/TenantRentContract").TenantRentContract[];
        userOneSignalSubscriptions: import("../db/entities/UserOneSignalSubscription").UserOneSignalSubscription[];
        userProfilePic: import("../db/entities/UserProfilePic").UserProfilePic;
        access: import("../db/entities/Access").Access;
    }>;
    getTenantByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<{
        totalUnreadNotif: number;
        userId: string;
        userName: string;
        password: string;
        fullName: string;
        gender: string;
        birthDate: string;
        mobileNumber: string;
        accessGranted: boolean;
        active: boolean;
        userCode: string;
        address: string;
        userType: string;
        contractPayments: import("../db/entities/ContractPayment").ContractPayment[];
        gatewayConnectedUsers: import("../db/entities/GatewayConnectedUsers").GatewayConnectedUsers[];
        notifications: import("../db/entities/Notifications").Notifications[];
        tenantRentBookings: import("../db/entities/TenantRentBooking").TenantRentBooking[];
        tenantRentContracts: import("../db/entities/TenantRentContract").TenantRentContract[];
        tenantRentContracts2: import("../db/entities/TenantRentContract").TenantRentContract[];
        userOneSignalSubscriptions: import("../db/entities/UserOneSignalSubscription").UserOneSignalSubscription[];
        userProfilePic: import("../db/entities/UserProfilePic").UserProfilePic;
        access: import("../db/entities/Access").Access;
    }>;
}
