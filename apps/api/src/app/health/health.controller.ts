import { Controller, Get } from '@nestjs/common'

import { ApiResource } from '@junta/contracts'

import { Public } from '@/api/common/decorators/public.decorator'

@Controller(ApiResource.health)
export class HealthController {
  @Public()
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' }
  }
}
