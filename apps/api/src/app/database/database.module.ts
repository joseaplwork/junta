import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { databaseOptions } from './database-options'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: ({ database }: AppConfig): TypeOrmModuleOptions =>
        databaseOptions(database),
    }),
  ],
})
export class DatabaseModule {}
