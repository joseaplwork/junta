import { INestApplication } from '@nestjs/common'
import cookieParser from 'cookie-parser'

import { API_PREFIX } from '@junta/contracts'

import { AppConfig } from './config/app-config'

/** HTTP-level setup shared by main.ts and the e2e tests, so both run the same app. */
export function configureApp(app: INestApplication, config: AppConfig): void {
  app.setGlobalPrefix(API_PREFIX)
  app.enableCors({ origin: config.corsOrigin, credentials: true })
  app.use(cookieParser())
}
