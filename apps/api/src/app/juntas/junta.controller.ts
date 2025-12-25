import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'

import { Permission } from '@junta/shared/enums/permission'

import { Permissions } from '@/api/decorators/permissions.decorator'

import { JuntaUpdatePayload } from './junta.interface'
import { JuntaService } from './junta.service'

@Controller('junta')
export class JuntaController {
  constructor(private readonly app: JuntaService) {}

  @Get()
  @Permissions(Permission.JUNTA_READ)
  getAllJuntas() {
    return this.app.findAll()
  }

  @Get(':id')
  @Permissions(Permission.JUNTA_READ)
  getJuntaById(@Param('id') id: string) {
    return this.app.findOneById(id)
  }

  @Post()
  @Permissions(Permission.JUNTA_CREATE)
  createJunta(
    @Req() req: { user: { userId: string } },
    @Body('name') name: string,
    @Body('amount') amount: number,
    @Body('slots') slots: number,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('active') active: boolean,
  ) {
    return this.app.createOne(
      { name, amount, slots, startDate, endDate, active },
      req.user.userId,
    )
  }

  @Patch(':id')
  @Permissions(Permission.JUNTA_UPDATE)
  updateJunta(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('amount') amount?: number,
    @Body('slots') slots?: number,
    @Body('startDate') startDate?: string,
    @Body('endDate') endDate?: string,
    @Body('active') active?: boolean,
  ) {
    const data: JuntaUpdatePayload = {}
    if (name !== undefined) data.name = name
    if (amount !== undefined) data.amount = amount
    if (slots !== undefined) data.slots = slots
    if (startDate !== undefined) data.startDate = startDate
    if (endDate !== undefined) data.endDate = endDate
    if (active !== undefined) data.active = active
    return this.app.update(id, data)
  }

  @Delete(':id')
  @Permissions(Permission.JUNTA_DELETE)
  async deleteJunta(@Param('id') id: string) {
    await this.app.remove(id)
    return { success: true }
  }
}
