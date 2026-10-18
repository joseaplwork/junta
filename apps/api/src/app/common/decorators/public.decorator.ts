import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/** Opts a route out of the global JWT guard. Every other route requires a valid access token. */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true)
