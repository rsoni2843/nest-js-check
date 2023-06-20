import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import env from 'src/config/env';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.route.path == '/health') return true;
    const apiKey = request.headers['x-api-key'];
    return apiKey === env.api_key;
  }
}
