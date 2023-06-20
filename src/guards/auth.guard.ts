import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import env from 'src/config/env';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    const access_token = request.cookies.access_token;
    if (!access_token) throw new UnauthorizedException('No token Found');
    const payload = this.verifyJwtToken(
      access_token,
      env.secrets.access_token_secret,
    );
    if (payload) {
      request.payload = payload;
      return true;
    } else return false;
  }
  private verifyJwtToken(token: string, secret: string): Promise<any> {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
