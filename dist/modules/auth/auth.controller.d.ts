import { Response } from 'express';
import { AuthService } from './auth.services';
import { LoginDto } from './dto/auth.dto';
import { LoginbyRefreshTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    TOKEN_LIMIT: Date;
    cookieOptions: {
        expires: Date;
        httpOnly: boolean;
        secure: boolean;
        origin: string;
    };
    constructor(authService: AuthService);
    logout(userId: string, response: Response): Promise<{
        message: string;
    }>;
    login(body: LoginDto, response: Response): Promise<{
        refresh_token: any;
    }>;
    requestAccessToken(refreshToken: LoginbyRefreshTokenDto, response: Response): Promise<{
        message: string;
    }>;
}
