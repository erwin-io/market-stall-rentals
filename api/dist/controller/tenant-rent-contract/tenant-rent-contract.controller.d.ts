import { CreateTenantRentContracFromBookingtDto, CreateTenantRentContractDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.create.dto";
import { UpdateTenantRentContractStatusDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { TenantRentContractService } from "src/services/tenant-rent-contract.service";
export declare class TenantRentContractController {
    private readonly tenantRentContractService;
    constructor(tenantRentContractService: TenantRentContractService);
    getDetails(tenantRentContractCode: string): Promise<ApiResponseModel<TenantRentContract>>;
    getAllByTenantUserCode(tenantUserCode: string): Promise<ApiResponseModel<any[]>>;
    getAllByCollectorUserCode(collectorUserCode: string): Promise<ApiResponseModel<any[]>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: TenantRentContract[];
        total: number;
    }>>;
    create(dto: CreateTenantRentContractDto): Promise<ApiResponseModel<TenantRentContract>>;
    createFromBooking(dto: CreateTenantRentContracFromBookingtDto): Promise<ApiResponseModel<TenantRentContract>>;
    updateStatus(tenantRentContractCode: string, dto: UpdateTenantRentContractStatusDto): Promise<ApiResponseModel<TenantRentContract>>;
}
