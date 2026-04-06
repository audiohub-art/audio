import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../strategies/jwt.strategy';
import { Request } from 'express';
import { JwtRefreshPayload } from '../strategies/jwt-refresh.strategy';

type UserPayload = JwtPayload | JwtRefreshPayload;

export const CurrentUser = createParamDecorator(
  (field: keyof JwtRefreshPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;

    return field ? (user as JwtRefreshPayload)?.[field] : user;
  },
);
