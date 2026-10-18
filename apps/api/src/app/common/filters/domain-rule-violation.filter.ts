import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

import { DomainRuleViolation } from '@junta/domain'

/** Business rule violations from @junta/domain become HTTP 400 with the rule id. */
@Catch(DomainRuleViolation)
export class DomainRuleViolationFilter implements ExceptionFilter {
  catch(exception: DomainRuleViolation, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(HttpStatus.BAD_REQUEST)
      .json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: exception.message,
        rule: exception.rule,
      })
  }
}
