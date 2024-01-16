import { Files } from "./Files";
import { Stalls } from "./Stalls";
export declare class StallClassifications {
    stallClassificationId: string;
    stallClassificationsCode: string | null;
    name: string;
    location: string;
    active: boolean;
    dateAdded: Date;
    dateLastUpdated: Date | null;
    thumbnailFile: Files;
    stalls: Stalls[];
}
