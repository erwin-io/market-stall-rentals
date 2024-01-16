import { CreateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.create.dto";
import { UpdateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { StallClassificationsService } from "src/services/stall-classifications.service";
export declare class StallClassificationsController {
    private readonly stallClassificationsService;
    constructor(stallClassificationsService: StallClassificationsService);
    getDetails(stallClassificationsCode: string): Promise<ApiResponseModel<StallClassifications>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: StallClassifications[];
        total: number;
    }>>;
    create(stallClassificationsDto: CreateStallClassificationDto): Promise<ApiResponseModel<StallClassifications>>;
    update(stallClassificationsCode: string, dto: UpdateStallClassificationDto): Promise<ApiResponseModel<StallClassifications>>;
    delete(stallClassificationsCode: string): Promise<ApiResponseModel<StallClassifications>>;
}
