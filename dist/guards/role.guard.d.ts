import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
