import { CreateTenantRentBookingDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.create.dto";
import { UpdateTenantRentBookingDto, UpdateTenantRentBookingStatusDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.update.dto";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
export declare class TenantRentBookingService {
    private readonly tenantRentBookingRepo;
    private pusherService;
    private oneSignalNotificationService;
    constructor(tenantRentBookingRepo: Repository<TenantRentBooking>, pusherService: PusherService, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: TenantRentBooking[];
        total: number;
    }>;
    getByCode(tenantRentBookingCode?: string): Promise<TenantRentBooking>;
    create(dto: CreateTenantRentBookingDto): Promise<TenantRentBooking>;
    update(tenantRentBookingCode: any, dto: UpdateTenantRentBookingDto): Promise<TenantRentBooking>;
    updateStatus(tenantRentBookingCode: any, dto: UpdateTenantRentBookingStatusDto): Promise<TenantRentBooking>;
    logNotification(users: Users[], data: TenantRentBooking, entityManager: EntityManager, title: string, description: string): Promise<string[]>;
    syncRealTime(userIds: string[], data: TenantRentBooking): Promise<void>;
}
