import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { RegisterTenantUserDto } from "src/core/dto/auth/register.dto";
import { Users } from "src/db/entities/Users";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerTenant(createUserDto: RegisterTenantUserDto): Promise<ApiResponseModel<Users>>;
    loginStaff(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
    loginTenant(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
}
