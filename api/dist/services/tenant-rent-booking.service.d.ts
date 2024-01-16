import { CreateTenantRentBookingDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.create.dto";
import { UpdateTenantRentBookingDto, UpdateTenantRentBookingStatusDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.update.dto";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { Repository } from "typeorm";
export declare class TenantRentBookingService {
    private readonly tenantRentBookingRepo;
    constructor(tenantRentBookingRepo: Repository<TenantRentBooking>);
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
    update(tenantRentBookingId: any, dto: UpdateTenantRentBookingDto): Promise<TenantRentBooking>;
    updateStaus(tenantRentBookingId: any, dto: UpdateTenantRentBookingStatusDto): Promise<TenantRentBooking>;
}
