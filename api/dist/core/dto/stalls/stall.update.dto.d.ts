import { DefaultStallDto } from "./stall-base.dto";
export declare class UpdateStallDto extends DefaultStallDto {
}
export declare class UpdateStallStatusDto {
    status: "AVAILABLE" | "INMAINTENANCE" | "UNAVAILABLE";
}
