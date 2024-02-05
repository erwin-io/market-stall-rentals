import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { Repository } from "typeorm";
import { PusherService } from "./pusher.service";
export declare class ContractPaymentService {
    private readonly contractPaymentRepo;
    private pusherService;
    constructor(contractPaymentRepo: Repository<ContractPayment>, pusherService: PusherService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ContractPayment[];
        total: number;
    }>;
    getByCode(contractPaymentCode: any): Promise<ContractPayment>;
    create(dto: CreateContractPaymentDto): Promise<ContractPayment>;
}
