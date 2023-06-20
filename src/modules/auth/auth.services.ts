import {
  HttpException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { LoginDto, LoginbyRefreshTokenDto } from './dto/auth.dto';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import env from 'src/config/env';
import { RedisService } from 'src/utils/redis-service';
import constant from 'src/config/constant';
@Injectable()
export class AuthService {
  constructor(private redisService: RedisService) {}
  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      this.redisService.del(userId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Failed to delete refresh token');
    }
  }
  async login(body: LoginDto) {
    const { email_or_mobile, password } = body;
    const access_token_expiry = constant.TIME_FRAMES.ACCESS_TOKEN_EXPIRY;
    const refresh_token_expiry = constant.TIME_FRAMES.REFRESH_TOKEN_EXPIRY;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
      },
    });

    if (!user) {
      throw new NotFoundException('User with this Credential not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Email or Mobile and Password in Not Matching',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const acesstoken = jwt.sign(
      {
        userId: user.id,
        role: user.role_type,
      },
      env.secrets.access_token_secret,
      { expiresIn: access_token_expiry },
    );
    const refreshtoken = jwt.sign(
      {
        userId: user.id,
        role: user.role_type,
      },
      env.secrets.refresh_token_secret,
      { expiresIn: refresh_token_expiry },
    );
    try {
      this.redisService.set(
        user.id,
        refreshtoken,
        constant.TIME_FRAMES.SEVEN_DAYS,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Unable to Login');
    }

    return { acesstoken, refreshtoken };
  }
  async requestAccessToken(body: LoginbyRefreshTokenDto) {
    const access_token_expiry = constant.TIME_FRAMES.ACCESS_TOKEN_EXPIRY;
    const { refreshToken } = body;
    try {
      const decoded = jwt.verify(
        refreshToken,
        env.secrets.refresh_token_secret,
      );
      const { userId, role } = decoded;
      const refresh_token = await this.redisService.get(userId);
      if (!refresh_token)
        throw new BadRequestException('Invalid Refresh Token');
      const acesstoken = jwt.sign(
        {
          userId: userId,
          role: role,
        },
        env.secrets.access_token_secret,
        { expiresIn: access_token_expiry },
      );
      return acesstoken;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid Refresh Token');
    }
  }
}
