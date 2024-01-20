import { CreateStallDto } from "src/core/dto/stalls/stall.create.dto";
import { UpdateStallDto } from "src/core/dto/stalls/stall.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StallsService } from "src/services/stalls.service";
import { Stalls } from "src/db/entities/Stalls";
export declare class StallController {
    private readonly stallService;
    constructor(stallService: StallsService);
    getByCode(stallCode: string): Promise<ApiResponseModel<Stalls>>;
    getAllByTenantUserCode(tenantUserCode: string): Promise<ApiResponseModel<Stalls[]>>;
    getDetails(stallId: string): Promise<ApiResponseModel<Stalls>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Stalls[];
        total: number;
    }>>;
    create(stallDto: CreateStallDto): Promise<ApiResponseModel<Stalls>>;
    update(stallId: string, dto: UpdateStallDto): Promise<ApiResponseModel<Stalls>>;
    delete(stallId: string): Promise<ApiResponseModel<Stalls>>;
}
