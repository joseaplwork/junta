import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'

import { API_PREFIX } from '@junta/contracts'

import { AppModule } from './app/app.module'
import { APP_CONFIG, AppConfig } from './app/config/app-config'
import { configureApp } from './app/configure-app'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get<AppConfig>(APP_CONFIG)

  if (await app.get(DataSource).showMigrations()) {
    throw new Error(
      'The database has pending migrations. Run npx nx run @junta/api:migration-run first.',
    )
  }

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
