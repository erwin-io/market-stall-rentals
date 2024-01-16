import { CreateStallDto } from "src/core/dto/stalls/stall.create.dto";
import { UpdateStallDto, UpdateStallStatusDto } from "src/core/dto/stalls/stall.update.dto";
import { Stalls } from "src/db/entities/Stalls";
import { Repository } from "typeorm";
export declare class StallsService {
    private readonly stallRepo;
    constructor(stallRepo: Repository<Stalls>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Stalls[];
        total: number;
    }>;
    getById(stallId: any): Promise<Stalls>;
    getByCode(stallCode?: string): Promise<Stalls>;
    create(dto: CreateStallDto): Promise<Stalls>;
    update(stallId: any, dto: UpdateStallDto): Promise<Stalls>;
    updateStatus(stallId: any, dto: UpdateStallStatusDto): Promise<Stalls>;
    delete(stallId: any): Promise<Stalls>;
}
