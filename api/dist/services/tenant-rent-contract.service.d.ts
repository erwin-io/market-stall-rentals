import { CreateTenantRentContracFromBookingtDto, CreateTenantRentContractDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.create.dto";
import { UpdateTenantRentContractStatusDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.update.dto";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
export declare class TenantRentContractService {
    private readonly tenantRentContractRepo;
    private pusherService;
    private oneSignalNotificationService;
    constructor(tenantRentContractRepo: Repository<TenantRentContract>, pusherService: PusherService, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: TenantRentContract[];
        total: number;
    }>;
    getByCode(tenantRentContractCode: any): Promise<TenantRentContract>;
    getAllByTenantUserCode(tenantUserCode: any): Promise<any[]>;
    getAllByCollectorUserCode(collectorUserCode: any, date: Date): Promise<any[]>;
    create(dto: CreateTenantRentContractDto): Promise<TenantRentContract>;
    createFromBooking(dto: CreateTenantRentContracFromBookingtDto): Promise<TenantRentContract>;
    updateStatus(tenantRentContractCode: any, dto: UpdateTenantRentContractStatusDto): Promise<TenantRentContract>;
    logNotification(users: Users[], data: TenantRentContract, entityManager: EntityManager, title: string, description: string): Promise<string[]>;
    syncRealTime(userIds: string[], data: TenantRentContract): Promise<void>;
}
