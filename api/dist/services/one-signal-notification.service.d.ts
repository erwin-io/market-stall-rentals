import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
export declare class OneSignalNotificationService {
    private readonly httpService;
    private readonly config;
    constructor(httpService: HttpService, config: ConfigService);
    sendToExternalUser(userId: string, type: "ANNOUNCEMENT" | "TENANT_RENT_BOOKING" | "TENANT_RENT_CONTRACT" | "TENANT_RENT_BILLING_REMINDER" | any, referenceId: any, notificationIds: any[], title: any, description: any): Promise<{
        userId: string;
        success: boolean;
    }>;
    setExternalUserId(subscriptionId: string, externalUserId: string): Promise<any>;
    setTags(subscriptionId: string, tags: any): Promise<any>;
}
