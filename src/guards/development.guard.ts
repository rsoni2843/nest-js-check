import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DevelopmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}
