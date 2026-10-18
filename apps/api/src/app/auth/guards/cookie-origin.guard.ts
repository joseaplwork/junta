import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

/**
 * Guards the endpoints that read or set the refresh cookie. The cookie is
 * `SameSite=None`, so a form on another site could post to them with it.
 * Browsers send `Origin` on those requests: refuse any origin outside
 * `CORS_ORIGIN`. Requests without `Origin`, such as native or server clients,
 * pass because no browser attaches a cookie to them for another site.
 */
@Injectable()
export class CookieOriginGuard implements CanActivate {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const origin = context.switchToHttp().getRequest<Request>().headers.origin

    if (origin === undefined || this.config.corsOrigins.includes(origin)) {
      return true
    }

    throw new ForbiddenException('Cross-site request refused')
  }
}
