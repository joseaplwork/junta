import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { API_PREFIX } from '@junta/contracts'

import { AppModule } from './app/app.module'
import { APP_CONFIG, AppConfig } from './app/config/app-config'
import { configureApp } from './app/configure-app'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get<AppConfig>(APP_CONFIG)

  configureApp(app, config)
  await app.listen(config.port)

  Logger.log(
    `API listening on http://localhost:${config.port}/${API_PREFIX}`,
    'Bootstrap',
  )
}

void bootstrap()
