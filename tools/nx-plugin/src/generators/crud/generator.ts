import { GeneratorCallback, Tree, formatFiles, logger } from '@nx/devkit'

import {
  adminCrudPageNextSteps,
  writeAdminCrudPage,
} from '../admin-crud-page/generator'
import {
  apiResourceNextSteps,
  writeApiResource,
} from '../api-resource/generator'

import { CrudSchema } from './schema'

export async function crudGenerator(
  tree: Tree,
  options: CrudSchema,
): Promise<GeneratorCallback> {
  const names = writeApiResource(tree, options)

  writeAdminCrudPage(tree, options)

  if (!options.skipFormat) await formatFiles(tree)

  return () => {
    logger.info(apiResourceNextSteps(names))
    logger.info(adminCrudPageNextSteps(names))
  }
}

export default crudGenerator
