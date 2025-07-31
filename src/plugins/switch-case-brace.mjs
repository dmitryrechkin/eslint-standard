/**
 * Custom ESLint plugin rule to enforce Allman-style brace placement for switch case blocks
 * Forces case block opening braces to be on new lines
 * 
 * Example:
 * case 'VALUE':
 * {
 *     // code here
 * }
 */

const switchCaseBraceRule = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce Allman-style brace placement for switch case blocks',
			category: 'Stylistic Issues',
			recommended: false
		},
		fixable: 'whitespace',
		schema: [],
		messages: {
			expectedNewlineBeforeOpeningBrace: 'Expected a newline before opening brace in case block.',
			expectedNewlineAfterOpeningBrace: 'Expected a newline after opening brace in case block.'
		}
	},

	create(context) {
		const sourceCode = context.getSourceCode();

		/**
		 * Check if a case clause has a block statement and enforce proper brace placement
		 * @param {ASTNode} node - The SwitchCase node
		 */
		function checkCaseClause(node) {
			// Only process case clauses that have a single BlockStatement
			if (node.consequent.length !== 1 || node.consequent[0].type !== 'BlockStatement') {
				return;
			}

			const blockStatement = node.consequent[0];
			const openingBrace = sourceCode.getFirstToken(blockStatement);
			const closingBrace = sourceCode.getLastToken(blockStatement);

			// Get the colon token after case label
			const colonToken = sourceCode.getTokenAfter(node.test || sourceCode.getFirstToken(node));

			// Check if opening brace is on the same line as the colon
			if (colonToken.loc.end.line === openingBrace.loc.start.line) {
				context.report({
					node: blockStatement,
					messageId: 'expectedNewlineBeforeOpeningBrace',
					fix(fixer) {
						// Add newline and proper indentation before opening brace
						const indentation = '\t'.repeat(getIndentLevel(node) + 1);
						return fixer.replaceTextRange(
							[colonToken.range[1], openingBrace.range[0]],
							`\n${indentation}`
						);
					}
				});
			}
		}

		/**
		 * Get the indentation level for a node
		 * @param {ASTNode} node - The node to check
		 * @returns {number} The indentation level
		 */
		function getIndentLevel(node) {
			const line = sourceCode.lines[node.loc.start.line - 1];
			const match = line.match(/^(\t*)/);
			return match ? match[1].length : 0;
		}

		return {
			SwitchCase: checkCaseClause
		};
	}
};

export default {
	rules: {
		'switch-case-brace-style': switchCaseBraceRule
	}
};