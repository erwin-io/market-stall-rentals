import { CreateMachineDto } from "src/core/dto/machines/machines.create.dto";
import { UpdateMachineDto } from "src/core/dto/machines/machines.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Machines } from "src/db/entities/Machines";
import { MachinesService } from "src/services/machines.service";
export declare class MachinesController {
    private readonly machinesService;
    constructor(machinesService: MachinesService);
    getDetails(machineCode: string): Promise<ApiResponseModel<Machines>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Machines[];
        total: number;
    }>>;
    create(machinesDto: CreateMachineDto): Promise<ApiResponseModel<Machines>>;
    batchCreate(machinesDto: CreateMachineDto[]): Promise<ApiResponseModel<Machines[]>>;
    update(machineCode: string, dto: UpdateMachineDto): Promise<ApiResponseModel<Machines>>;
    delete(machineCode: string): Promise<ApiResponseModel<Machines>>;
}
