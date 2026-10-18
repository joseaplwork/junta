import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Junta } from './entities/junta.entity'
import { JuntasController } from './juntas.controller'
import { JuntasService } from './juntas.service'

@Module({
  imports: [TypeOrmModule.forFeature([Junta])],
  controllers: [JuntasController],
  providers: [JuntasService],
  exports: [JuntasService],
})
export class JuntasModule {}
