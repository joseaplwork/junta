import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import {
  AuthenticatedAccount,
  AuthenticatedRequest,
} from '@/api/common/auth/authenticated-account'

export const CurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAccount =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
)
