import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JuntaController } from './junta.controller'
import { Junta } from './junta.entity'
import { JuntaService } from './junta.service'

@Module({
  imports: [TypeOrmModule.forFeature([Junta])],
  controllers: [JuntaController],
  providers: [JuntaService],
  exports: [JuntaService],
})
export class JuntaModule {}
