import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '@/api/decorators/is-public.decorator'

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
