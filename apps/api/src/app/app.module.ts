import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Admin } from './admins/admin.entity'
import { AdminModule } from './admins/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { Junta } from './juntas/junta.entity'
import { JuntaModule } from './juntas/junta.module'
import { User } from './users/user.entity'
import { UserModule } from './users/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'joseparedes',
      password: 'admin',
      database: 'juntas',
      entities: [User, Admin, Junta],
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
    }),
    AuthModule,
    UserModule,
    AdminModule,
    JuntaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
