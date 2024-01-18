import { CreateTenantRentBookingDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.create.dto";
import { UpdateTenantRentBookingDto, UpdateTenantRentBookingStatusDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentBookingService } from "src/services/tenant-rent-booking.service";
export declare class TenantRentBookingController {
    private readonly tenantRentBookingService;
    constructor(tenantRentBookingService: TenantRentBookingService);
    getDetails(tenantRentBookingCode: string): Promise<ApiResponseModel<TenantRentBooking>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: TenantRentBooking[];
        total: number;
    }>>;
    create(tenantRentBookingDto: CreateTenantRentBookingDto): Promise<ApiResponseModel<TenantRentBooking>>;
    update(tenantRentBookingCode: string, dto: UpdateTenantRentBookingDto): Promise<ApiResponseModel<TenantRentBooking>>;
    updateStatus(tenantRentBookingCode: string, dto: UpdateTenantRentBookingStatusDto): Promise<ApiResponseModel<TenantRentBooking>>;
}
