import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { dirname, resolve, sep } from 'path'

export const RULE_NAME = 'no-cross-page-imports'

/** A page folder of an Angular app: `apps/<app>/src/app/pages/<page>/`. */
export interface PageLocation {
  app: string
  page: string
}

const ALIAS_PATTERN = /^@\/([^/]+)\/pages\/([^/]+)/

/** The app and page folder that contain `absolutePath`, if any. */
export function pageOf(absolutePath: string): PageLocation | null {
  const parts = absolutePath.split(sep)

  for (let index = 0; index + 5 < parts.length; index++) {
    if (
      parts[index] === 'apps' &&
      parts[index + 2] === 'src' &&
      parts[index + 3] === 'app' &&
      parts[index + 4] === 'pages' &&
      parts[index + 5]
    ) {
      return { app: parts[index + 1], page: parts[index + 5] }
    }
  }

  return null
}

function targetPage(
  importPath: string,
  importerPath: string,
): PageLocation | null {
  const alias = importPath.match(ALIAS_PATTERN)

  if (alias) return { app: alias[1], page: alias[2] }

  if (importPath.startsWith('.')) {
    return pageOf(resolve(dirname(importerPath), importPath))
  }

  return null
}

/**
 * Pages of the Angular apps are independent vertical slices: a file in
 * pages/<a>/ must not import from pages/<b>/. Code needed by two pages belongs
 * in that app's src/app/shared/.
 */
export const rule = ESLintUtils.RuleCreator(
  () => 'https://github.com/joseaplwork/junta/blob/main/AGENTS.md',
)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid imports between app pages; shared code goes in shared/.',
    },
    schema: [],
    messages: {
      crossPage:
        'Page "{{source}}" imports from page "{{target}}". Move the shared code to apps/{{app}}/src/app/shared/ (see apps/{{app}}/AGENTS.md).',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    const source = pageOf(filename)

    if (!source) return {}

    const check = (node: TSESTree.Node, importPath: string): void => {
      const target = targetPage(importPath, filename)

      if (
        target &&
        (target.app !== source.app || target.page !== source.page)
      ) {
        context.report({
          node,
          messageId: 'crossPage',
          data: {
            source: `${source.app}/${source.page}`,
            target: `${target.app}/${target.page}`,
            app: source.app,
          },
        })
      }
    }

    return {
      ImportDeclaration(node) {
        check(node, node.source.value)
      },
      ImportExpression(node) {
        if (
          node.source.type === TSESTree.AST_NODE_TYPES.Literal &&
          typeof node.source.value === 'string'
        ) {
          check(node, node.source.value)
        }
      },
    }
  },
})
