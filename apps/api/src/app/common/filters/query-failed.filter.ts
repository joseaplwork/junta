import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

const UNIQUE_VIOLATION = '23505'
const FOREIGN_KEY_VIOLATION = '23503'

/**
 * Unique and foreign-key violations become HTTP 409, for example a duplicate
 * admin email or deleting a row that other rows still reference.
 * Any other database error becomes a generic HTTP 500.
 */
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedFilter.name)

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    const code = (exception.driverError as { code?: string } | undefined)?.code

    if (code === UNIQUE_VIOLATION || code === FOREIGN_KEY_VIOLATION) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message:
          code === UNIQUE_VIOLATION
            ? 'A record with the same unique value already exists'
            : 'The record is referenced by other records',
      })

      return
    }

    this.logger.error(exception.message, exception.stack)
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    })
  }
}
