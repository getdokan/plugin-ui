/**
 * Babel plugin that extracts wrapper/demo function source code and injects it
 * as `parameters.docs.source.code` into Storybook story exports.
 *
 * Problem:  Stories that use `render: () => <DemoWrapper />` cause Storybook's
 *           "Show code" panel to display `<DemoWrapper />` instead of the actual
 *           component usage inside the wrapper.
 *
 * Solution: At compile time, this plugin:
 *   1. Collects all top-level non-exported function declarations (the wrappers).
 *   2. For each story export whose render body is `<WrapperName />`, it copies
 *      the wrapper function's original source into
 *      `parameters.docs.source.code` so Storybook displays it verbatim.
 */
module.exports = function storySourcePlugin({ types: t }) {
  return {
    name: 'story-source-injector',
    visitor: {
      Program: {
        enter(programPath, state) {
          const fileSource = state.file.code;
          if (!fileSource) return;

          // ── Step 1: collect wrapper functions ────────────────────────
          const wrapperFunctions = new Map();

          for (const stmt of programPath.get('body')) {
            // Skip any exported declaration
            if (
              stmt.isExportNamedDeclaration() ||
              stmt.isExportDefaultDeclaration()
            ) {
              continue;
            }

            if (stmt.isFunctionDeclaration()) {
              const name = stmt.node.id?.name;
              if (!name) continue;

              const { start, end } = stmt.node;
              if (start == null || end == null) continue;

              wrapperFunctions.set(name, fileSource.slice(start, end));
            }
          }

          if (wrapperFunctions.size === 0) return;

          // ── Step 2: inject source into matching story exports ────────
          for (const stmt of programPath.get('body')) {
            if (!stmt.isExportNamedDeclaration()) continue;

            const decl = stmt.get('declaration');
            if (!decl.isVariableDeclaration()) continue;

            for (const declarator of decl.get('declarations')) {
              let init = declarator.get('init');

              // Unwrap `{ ... } satisfies Type` or `{ ... } as Type`
              if (
                init.isTSSatisfiesExpression?.() ||
                init.isTSAsExpression?.()
              ) {
                init = init.get('expression');
              }

              if (!init.isObjectExpression()) continue;

              const properties = init.get('properties');

              // Find `render` property
              const renderProp = properties.find(
                (p) =>
                  p.isObjectProperty() &&
                  p.get('key').isIdentifier({ name: 'render' })
              );
              if (!renderProp) continue;

              const renderVal = renderProp.get('value');
              if (!renderVal.isArrowFunctionExpression()) continue;

              const renderBody = renderVal.get('body');
              if (!renderBody.isJSXElement()) continue;

              // Must be a self-closing element: <WrapperName />
              const opening = renderBody.get('openingElement');
              const nameNode = opening.get('name');
              if (!nameNode.isJSXIdentifier()) continue;

              const wrapperName = nameNode.node.name;
              if (!wrapperFunctions.has(wrapperName)) continue;

              // Skip stories that already define their own `parameters`
              const hasParams = properties.some(
                (p) =>
                  p.isObjectProperty() &&
                  p.get('key').isIdentifier({ name: 'parameters' })
              );
              if (hasParams) continue;

              // Build: parameters: { docs: { source: { code, language } } }
              const sourceCode = wrapperFunctions.get(wrapperName);

              const sourceObj = t.objectExpression([
                t.objectProperty(
                  t.identifier('code'),
                  t.stringLiteral(sourceCode)
                ),
                t.objectProperty(
                  t.identifier('language'),
                  t.stringLiteral('tsx')
                ),
              ]);

              const docsObj = t.objectExpression([
                t.objectProperty(t.identifier('source'), sourceObj),
              ]);

              const paramsObj = t.objectExpression([
                t.objectProperty(t.identifier('docs'), docsObj),
              ]);

              init.node.properties.push(
                t.objectProperty(t.identifier('parameters'), paramsObj)
              );
            }
          }
        },
      },
    },
  };
};
