import { Tree } from '@nx/devkit'
import * as ts from 'typescript'

interface Source {
  text: string
  file: ts.SourceFile
}

function readSource(tree: Tree, path: string): Source {
  const text = tree.read(path, 'utf-8')

  if (text === null) {
    throw new Error(`Expected ${path} to exist.`)
  }

  return {
    text,
    file: ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true),
  }
}

function insertAt(text: string, position: number, insertion: string): string {
  return text.slice(0, position) + insertion + text.slice(position)
}

function structureError(path: string, description: string): Error {
  return new Error(
    `Could not find ${description} in ${path}. The file no longer has the shape the generator expects: update tools/nx-plugin/src/utils/ast.ts or the file.`,
  )
}

function unwrap(
  expression: ts.Expression | undefined,
): ts.Expression | undefined {
  let current = expression

  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current))
  ) {
    current = current.expression
  }

  return current
}

function propertyNamed(
  object: ts.ObjectLiteralExpression,
  name: string,
): ts.PropertyAssignment | undefined {
  return object.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === name,
  )
}

function findNode<T extends ts.Node>(
  root: ts.Node,
  predicate: (node: ts.Node) => node is T,
): T | undefined {
  let found: T | undefined

  const visit = (node: ts.Node): void => {
    if (found) return
    if (predicate(node)) {
      found = node

      return
    }

    ts.forEachChild(node, visit)
  }

  visit(root)

  return found
}

export type ArrayFinder = (
  file: ts.SourceFile,
) => ts.ArrayLiteralExpression | undefined

/** `export const NAME = [...]` (optionally `as const`). */
export const variableArray =
  (name: string): ArrayFinder =>
  file => {
    const declaration = findNode(
      file,
      (node): node is ts.VariableDeclaration =>
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === name,
    )
    const initializer = unwrap(declaration?.initializer)

    return initializer && ts.isArrayLiteralExpression(initializer)
      ? initializer
      : undefined
  }

/** The `imports` array of the `@Module({...})` decorator. */
export const moduleImportsArray: ArrayFinder = file => {
  const call = findNode(
    file,
    (node): node is ts.CallExpression =>
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'Module',
  )
  const [options] = call?.arguments ?? []
  const imports =
    options && ts.isObjectLiteralExpression(options)
      ? unwrap(propertyNamed(options, 'imports')?.initializer)
      : undefined

  return imports && ts.isArrayLiteralExpression(imports) ? imports : undefined
}

/** A class property initialized with an array, e.g. `readonly menuItems = [...]`. */
export const classPropertyArray =
  (className: string, propertyName: string): ArrayFinder =>
  file => {
    const classDeclaration = findNode(
      file,
      (node): node is ts.ClassDeclaration =>
        ts.isClassDeclaration(node) && node.name?.text === className,
    )
    const property = classDeclaration?.members.find(
      (member): member is ts.PropertyDeclaration =>
        ts.isPropertyDeclaration(member) &&
        ts.isIdentifier(member.name) &&
        member.name.text === propertyName,
    )
    const initializer = unwrap(property?.initializer)

    return initializer && ts.isArrayLiteralExpression(initializer)
      ? initializer
      : undefined
  }

/** The `children` array of the route whose `path` is `routePath`. */
export const routeChildrenArray =
  (routePath: string): ArrayFinder =>
  file => {
    const route = findNode(file, (node): node is ts.ObjectLiteralExpression => {
      if (!ts.isObjectLiteralExpression(node)) return false

      const path = propertyNamed(node, 'path')?.initializer

      return Boolean(
        path && ts.isStringLiteral(path) && path.text === routePath,
      )
    })
    const children = route
      ? unwrap(propertyNamed(route, 'children')?.initializer)
      : undefined

    return children && ts.isArrayLiteralExpression(children)
      ? children
      : undefined
  }

export function appendArrayElement(
  tree: Tree,
  path: string,
  findArray: ArrayFinder,
  element: string,
  description: string,
): void {
  const { text, file } = readSource(tree, path)
  const array = findArray(file)

  if (!array) throw structureError(path, description)

  const elements = array.elements
  const last = elements[elements.length - 1]

  if (elements.some(existing => existing.getText() === element)) return

  tree.write(
    path,
    last
      ? insertAt(text, last.getEnd(), `,\n${element}`)
      : insertAt(text, array.getStart() + 1, `\n${element}\n`),
  )
}

/** Adds an import statement after the last import, unless it is already there. */
export function addImport(tree: Tree, path: string, statement: string): void {
  const { text, file } = readSource(tree, path)

  if (text.includes(statement)) return

  const imports = file.statements.filter(ts.isImportDeclaration)
  const last = imports[imports.length - 1]

  tree.write(
    path,
    last
      ? insertAt(text, last.getEnd(), `\n${statement}`)
      : `${statement}\n${text}`,
  )
}

export function addEnumMembers(
  tree: Tree,
  path: string,
  enumName: string,
  members: string[],
): void {
  const { text, file } = readSource(tree, path)
  const declaration = file.statements.find(
    (statement): statement is ts.EnumDeclaration =>
      ts.isEnumDeclaration(statement) && statement.name.text === enumName,
  )

  if (!declaration) throw structureError(path, `enum ${enumName}`)

  const existing = new Set(
    declaration.members.map(member => member.name.getText()),
  )
  const additions = members.filter(
    member => !existing.has(member.split('=')[0].trim()),
  )
  const last = declaration.members[declaration.members.length - 1]

  if (additions.length === 0) return
  if (!last) throw structureError(path, `members of enum ${enumName}`)

  tree.write(path, insertAt(text, last.getEnd(), `,\n${additions.join(',\n')}`))
}

/** Inserts `key: value` into `const NAME = {...}`, keeping keys in alphabetical order. */
export function addSortedObjectProperty(
  tree: Tree,
  path: string,
  variableName: string,
  key: string,
  value: string,
): void {
  const { text, file } = readSource(tree, path)
  const declaration = findNode(
    file,
    (node): node is ts.VariableDeclaration =>
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName,
  )
  const object = unwrap(declaration?.initializer)

  if (!object || !ts.isObjectLiteralExpression(object)) {
    throw structureError(path, `object ${variableName}`)
  }

  if (propertyNamed(object, key)) return

  const properties = object.properties
  const next = properties.find(
    property => property.name !== undefined && property.name.getText() > key,
  )
  const entry = `${key}: ${value}`

  if (next) {
    tree.write(path, insertAt(text, next.getStart(), `${entry},\n`))
  } else if (properties.length > 0) {
    tree.write(
      path,
      insertAt(text, properties[properties.length - 1].getEnd(), `,\n${entry}`),
    )
  } else {
    tree.write(path, insertAt(text, object.getStart() + 1, `\n${entry}\n`))
  }
}

/** Adds an `export * from '...'` line to a barrel file and sorts the barrel. */
export function addSortedExport(tree: Tree, path: string, line: string): void {
  const text = tree.read(path, 'utf-8')

  if (text === null) throw new Error(`Expected ${path} to exist.`)

  const lines = new Set(
    text
      .split('\n')
      .map(current => current.trim())
      .filter(Boolean),
  )

  lines.add(line)
  tree.write(path, `${[...lines].sort().join('\n')}\n`)
}
