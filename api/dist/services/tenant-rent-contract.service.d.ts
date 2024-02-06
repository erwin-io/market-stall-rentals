import { CreateTenantRentContracFromBookingtDto, CreateTenantRentContractDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.create.dto";
import { UpdateTenantRentContractStatusDto } from "src/core/dto/tenant-rent-contract/tenant-rent-contract.update.dto";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { Repository } from "typeorm";
export declare class TenantRentContractService {
    private readonly tenantRentContractRepo;
    constructor(tenantRentContractRepo: Repository<TenantRentContract>);
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
}
