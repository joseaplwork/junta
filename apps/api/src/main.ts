import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'

import { API_PREFIX } from '@junta/contracts'

import { AppModule } from './app/app.module'
import { APP_CONFIG, AppConfig } from './app/config/app-config'
import { configureApp } from './app/configure-app'
import { assertNoPendingMigrations } from './app/database/pending-migrations'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get<AppConfig>(APP_CONFIG)

  await assertNoPendingMigrations(app.get(DataSource))

  configureApp(app, config)
  await app.listen(config.port)

  Logger.log(
    `API listening on http://localhost:${config.port}/${API_PREFIX}`,
    'Bootstrap',
  )
}

bootstrap().catch((error: unknown) => {
  Logger.error(error instanceof Error ? error.message : error, 'Bootstrap')
  process.exit(1)
})
