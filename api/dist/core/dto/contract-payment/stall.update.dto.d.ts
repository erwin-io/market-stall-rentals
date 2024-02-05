import { DefaultStallDto } from "./contract-payment-base.dto";
export declare class UpdateStallDto extends DefaultStallDto {
}
export declare class UpdateStallStatusDto {
    status: "AVAILABLE" | "OCCUPIED" | "UPCOMING" | "INMAINTENANCE" | "UNAVAILABLE";
}
