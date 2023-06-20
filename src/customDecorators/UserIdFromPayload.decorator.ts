import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
  payload: {
    userId: string;
  };
}
export const UserIdFromPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.payload.userId;
  },
);
