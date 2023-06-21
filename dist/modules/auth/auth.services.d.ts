import { LoginDto, LoginbyRefreshTokenDto } from './dto/auth.dto';
import { RedisService } from 'src/utils/redis-service';
export declare class AuthService {
    private redisService;
    constructor(redisService: RedisService);
    deleteRefreshToken(userId: string): Promise<void>;
    login(body: LoginDto): Promise<{
        acesstoken: any;
        refreshtoken: any;
    }>;
    requestAccessToken(body: LoginbyRefreshTokenDto): Promise<any>;
}
