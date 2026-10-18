import {
  rule as noCrossPageImports,
  RULE_NAME as noCrossPageImportsName,
} from './rules/no-cross-page-imports'

/**
 * Workspace lint rules. Nx loads this file automatically and exposes each rule
 * as `@nx/workspace-<name>` in .eslintrc.json files.
 */
module.exports = {
  rules: {
    [noCrossPageImportsName]: noCrossPageImports,
  },
}
