import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common'

import { AuthenticatedRequest } from '@/api/common/auth/authenticated-account'

/** The signed-in participant's id. Admin tokens carry none, so they get 403. */
export const CurrentParticipant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const participantId = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>().user.participantId

    if (!participantId) {
      throw new ForbiddenException('Only participants have their own juntas')
    }

    return participantId
  },
)
