import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import {
  AuthenticatedAdmin,
  AuthenticatedRequest,
} from '@/api/common/auth/authenticated-admin'

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAdmin =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
)
