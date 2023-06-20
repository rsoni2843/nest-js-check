import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      if (request.payload.role === 'superadmin') return true;
      else return false;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
