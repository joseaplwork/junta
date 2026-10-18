import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { ENTITIES } from './entities'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: ({ database }: AppConfig): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: database.host,
        port: database.port,
        username: database.username,
        password: database.password,
        database: database.name,
        entities: ENTITIES,
        synchronize: database.synchronize,
        logging: database.logging,
        logger: 'advanced-console',
      }),
    }),
  ],
})
export class DatabaseModule {}
