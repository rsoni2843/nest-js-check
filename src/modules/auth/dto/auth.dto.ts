import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';
import { roleType } from 'src/database/entities/user.entity';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly email_or_mobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
export class LoginbyRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
