import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
export declare class ContractPaymentService {
    private readonly contractPaymentRepo;
    private pusherService;
    private oneSignalNotificationService;
    constructor(contractPaymentRepo: Repository<ContractPayment>, pusherService: PusherService, oneSignalNotificationService: OneSignalNotificationService);
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
    logNotification(users: Users[], data: ContractPayment, entityManager: EntityManager, title: string, description: string): Promise<string[]>;
    syncRealTime(userIds: string[], data: ContractPayment): Promise<void>;
}
