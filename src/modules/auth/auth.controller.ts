import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.services';
import { LoginDto } from './dto/auth.dto';
import { LoginbyRefreshTokenDto } from './dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserIdFromPayload } from 'src/customDecorators/UserIdFromPayload.decorator';

@Controller('auth')
export class AuthController {
  TOKEN_LIMIT = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  cookieOptions = {
    expires: this.TOKEN_LIMIT,
    httpOnly: true,
    secure: true,
    origin: 'productcompare.dentalkart.com',
  };
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @UserIdFromPayload() userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('access_token');
    await this.authService.deleteRefreshToken(userId);
    return {
      message: 'Logout Successfully',
    };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(body);
    response.cookie('access_token', user.acesstoken, this.cookieOptions);
    return {
      refresh_token: user.refreshtoken,
    };
  }
  @Post('request-access-token')
  async requestAccessToken(
    @Body() refreshToken: LoginbyRefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const acesstoken = await this.authService.requestAccessToken(refreshToken);
    response.cookie('access_token', acesstoken, this.cookieOptions);
    return {
      message: 'Login Successfully by Refresh Token',
    };
  }
}
