import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Users } from "src/db/entities/Users";
import { RegisterTenantUserDto } from "src/core/dto/auth/register.dto";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<Users>, jwtService: JwtService);
    registerTenant(dto: RegisterTenantUserDto): Promise<Users>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getStaffByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getTenantByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
}
