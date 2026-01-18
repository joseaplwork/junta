import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly _app: AppService) {}

  @Get()
  getData() {
    return this._app.getData()
  }
}
