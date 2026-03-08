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
import { RequestWithAuthenticatedAdmin } from '@/api/interfaces/request.interface'

import { GroupConfig, JuntaUpdatePayload } from './junta.interface'
import { JuntaService } from './junta.service'

@Controller('junta')
export class JuntaController {
  constructor(private readonly _app: JuntaService) {}

  @Get()
  @Permissions(Permission.JUNTA_READ)
  getAllJuntas() {
    return this._app.findAll()
  }

  @Get(':id')
  @Permissions(Permission.JUNTA_READ)
  getJuntaById(@Param('id') id: string) {
    return this._app.findOneById(id)
  }

  @Post()
  @Permissions(Permission.JUNTA_CREATE)
  createJunta(
    @Req() req: RequestWithAuthenticatedAdmin,
    @Body('name') name: string,
    @Body('amount') amount: number,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('active') active: boolean,
    @Body('groupConfigs') groupConfigs: GroupConfig[],
  ) {
    return this._app.createOne(
      { name, amount, startDate, endDate, active, groupConfigs },
      req.admin.id,
    )
  }

  @Patch(':id')
  @Permissions(Permission.JUNTA_UPDATE)
  updateJunta(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('amount') amount?: number,
    @Body('startDate') startDate?: string,
    @Body('endDate') endDate?: string,
    @Body('active') active?: boolean,
    @Body('groupConfigs') groupConfigs?: GroupConfig[],
  ) {
    const data: JuntaUpdatePayload = {}
    if (name !== undefined) data.name = name
    if (amount !== undefined) data.amount = amount
    if (startDate !== undefined) data.startDate = startDate
    if (endDate !== undefined) data.endDate = endDate
    if (active !== undefined) data.active = active
    if (groupConfigs !== undefined) data.groupConfigs = groupConfigs
    return this._app.update(id, data)
  }

  @Delete(':id')
  @Permissions(Permission.JUNTA_DELETE)
  async deleteJunta(@Param('id') id: string) {
    await this._app.remove(id)
    return { success: true }
  }
}
