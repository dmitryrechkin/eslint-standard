/**
 * Custom ESLint plugin to enforce Allman brace style for TypeScript interfaces
 *
 * Note: Only handles interface declarations, not type aliases.
 * Type aliases are left to prettier-plugin-brace-style which keeps short
 * object types on a single line (by design).
 */

const interfaceBraceRule = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce Allman brace style for TypeScript interfaces',
			category: 'Stylistic Issues',
			recommended: false
		},
		fixable: 'whitespace',
		schema: []
	},

	create(context) {
		const sourceCode = context.sourceCode || context.getSourceCode();

		return {
			TSInterfaceDeclaration(node) {
				// Get the interface name token
				const interfaceId = node.id;
				const typeParams = node.typeParameters;
				const extendsClause = node.extends;

				// Find the opening brace
				let tokenBeforeBrace;
				if (node.heritage && node.heritage.length > 0) {
					// Interface extends something
					tokenBeforeBrace = node.heritage[node.heritage.length - 1];
				} else if (extendsClause && extendsClause.length > 0) {
					// Interface extends something (newer AST)
					tokenBeforeBrace = extendsClause[extendsClause.length - 1];
				} else if (typeParams) {
					// Interface has type parameters
					tokenBeforeBrace = typeParams;
				} else {
					// Simple interface
					tokenBeforeBrace = interfaceId;
				}

				// Get the opening brace token
				const openingBrace = sourceCode.getTokenAfter(tokenBeforeBrace, token => token.type === 'Punctuator' && token.value === '{');

				if (!openingBrace) return;

				// Check if there's a newline before the opening brace
				const tokenBefore = sourceCode.getTokenBefore(openingBrace);
				const textBetween = sourceCode.text.slice(tokenBefore.range[1], openingBrace.range[0]);

				// Check if brace is on the same line
				if (!textBetween.includes('\n')) {
					context.report({
						node: openingBrace,
						message: 'Opening brace should be on a new line (Allman style)',
						fix(fixer) {
							// Get the base indentation of the interface declaration
							const interfaceLine = sourceCode.getLines()[node.loc.start.line - 1];
							const baseIndentMatch = interfaceLine.match(/^(\s*)/);
							const baseIndent = baseIndentMatch ? baseIndentMatch[1] : '';

							// Replace the space before the brace with a newline and proper indentation
							return fixer.replaceTextRange(
								[tokenBefore.range[1], openingBrace.range[0]],
								'\n' + baseIndent
							);
						}
					});
				}
			}
			// Note: TSTypeAliasDeclaration handling removed to avoid conflict with prettier-plugin-brace-style
			// which keeps short object type literals on a single line
		};
	}
};

export default {
	rules: {
		'interface-brace-style': interfaceBraceRule
	}
};