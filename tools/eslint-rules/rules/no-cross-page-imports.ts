import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { dirname, resolve, sep } from 'path'

export const RULE_NAME = 'no-cross-page-imports'

const PAGES_SEGMENT = ['apps', 'admin', 'src', 'app', 'pages'].join(sep) + sep
const PAGES_ALIAS = '@/admin/pages/'

/** Name of the admin page folder that contains `absolutePath`, if any. */
export function pageOf(absolutePath: string): string | null {
  const index = absolutePath.indexOf(PAGES_SEGMENT)

  if (index === -1) return null

  const [page] = absolutePath.slice(index + PAGES_SEGMENT.length).split(sep)

  return page || null
}

function targetPage(importPath: string, importerPath: string): string | null {
  if (importPath.startsWith(PAGES_ALIAS)) {
    return importPath.slice(PAGES_ALIAS.length).split('/')[0] || null
  }

  if (importPath.startsWith('.')) {
    return pageOf(resolve(dirname(importerPath), importPath))
  }

  return null
}

/**
 * Admin pages are independent vertical slices: a file in pages/<a>/ must not
 * import from pages/<b>/. Code needed by two pages belongs in src/app/shared/.
 */
export const rule = ESLintUtils.RuleCreator(
  () => 'https://github.com/joseaplwork/junta/blob/main/apps/admin/AGENTS.md',
)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid imports between admin pages; shared code goes in shared/.',
    },
    schema: [],
    messages: {
      crossPage:
        'Page "{{source}}" imports from page "{{target}}". Move the shared code to apps/admin/src/app/shared/ (see apps/admin/AGENTS.md).',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    const sourcePage = pageOf(filename)

    if (!sourcePage) return {}

    const check = (node: TSESTree.Node, importPath: string): void => {
      const target = targetPage(importPath, filename)

      if (target && target !== sourcePage) {
        context.report({
          node,
          messageId: 'crossPage',
          data: { source: sourcePage, target },
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
