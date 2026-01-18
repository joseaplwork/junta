import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, admin, info, context) {
    if (err || !admin) {
      throw err || new UnauthorizedException()
    }

    const request = context.switchToHttp().getRequest()
    request.admin = admin

    return admin
  }
}
