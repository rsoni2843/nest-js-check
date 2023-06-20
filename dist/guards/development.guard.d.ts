import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class DevelopmentGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
