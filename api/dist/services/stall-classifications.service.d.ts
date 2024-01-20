import { CreateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.create.dto";
import { UpdateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.update.dto";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { Repository } from "typeorm";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
export declare class StallClassificationsService {
    private firebaseProvoder;
    private readonly stallClassificationRepo;
    constructor(firebaseProvoder: FirebaseProvider, stallClassificationRepo: Repository<StallClassifications>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: StallClassifications[];
        total: number;
    }>;
    getAll(): Promise<StallClassifications[]>;
    getByCode(stallClassificationsCode: any): Promise<StallClassifications>;
    create(dto: CreateStallClassificationDto): Promise<StallClassifications>;
    update(stallClassificationsCode: any, dto: UpdateStallClassificationDto): Promise<StallClassifications>;
    delete(stallClassificationsCode: any): Promise<StallClassifications>;
}
