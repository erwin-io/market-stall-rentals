import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ContractPaymentService } from "src/services/contract-payment.service";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
export declare class ContractPaymentController {
    private readonly contractPaymentService;
    constructor(contractPaymentService: ContractPaymentService);
    getByCode(contractPaymentCode: string): Promise<ApiResponseModel<ContractPayment>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: ContractPayment[];
        total: number;
    }>>;
    create(contractPaymentDto: CreateContractPaymentDto): Promise<ApiResponseModel<ContractPayment>>;
}
