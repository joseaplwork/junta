import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Junta } from './junta.entity'
import { JuntaPayload, JuntaUpdatePayload } from './junta.interface'

@Injectable()
export class JuntaService {
  constructor(
    @InjectRepository(Junta)
    private juntasRepository: Repository<Junta>,
  ) {}

  createOne(
    { name, amount, slots, startDate, endDate, active }: JuntaPayload,
    adminId: string,
  ): Promise<Junta> {
    const partialAmount = Math.floor(amount / slots)

    const junta = this.juntasRepository.create({
      name,
      amount,
      slots,
      partial_amount: partialAmount,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      active: active,
      admin_id: adminId,
    })

    return this.juntasRepository.save(junta)
  }

  findOneById(id: string): Promise<Junta | null> {
    return this.juntasRepository.findOne({ where: { id } })
  }

  findAll(): Promise<Junta[]> {
    return this.juntasRepository.find()
  }

  findByAdminId(adminId: string): Promise<Junta[]> {
    return this.juntasRepository.find({ where: { admin_id: adminId } })
  }

  async update(id: string, data: JuntaUpdatePayload): Promise<Junta> {
    const junta = await this.findOneById(id)
    if (!junta) throw new NotFoundException('Junta not found')

    if (data.name !== undefined) junta.name = data.name
    if (data.amount !== undefined) junta.amount = data.amount
    if (data.slots !== undefined) junta.slots = data.slots
    if (data.startDate !== undefined)
      junta.start_date = new Date(data.startDate)
    if (data.endDate !== undefined) junta.end_date = new Date(data.endDate)
    if (data.active !== undefined) junta.active = data.active

    if (data.amount !== undefined || data.slots !== undefined) {
      junta.partial_amount = Math.floor(junta.amount / junta.slots)
    }

    return this.juntasRepository.save(junta)
  }

  async remove(id: string): Promise<void> {
    const junta = await this.findOneById(id)
    if (!junta) throw new NotFoundException('Junta not found')
    await this.juntasRepository.remove(junta)
  }
}
