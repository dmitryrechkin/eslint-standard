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

			// Check if content inside braces needs proper formatting
			if (blockStatement.body.length > 0) {
				const firstStatement = blockStatement.body[0];
				const firstStatementToken = sourceCode.getFirstToken(firstStatement);
				
				// Check if the first statement is on the same line as opening brace
				if (openingBrace.loc.end.line === firstStatementToken.loc.start.line) {
					context.report({
						node: firstStatement,
						messageId: 'expectedNewlineAfterOpeningBrace',
						fix(fixer) {
							// Add newline and proper indentation after opening brace
							const indentation = '\t'.repeat(getIndentLevel(node) + 2);
							const fixes = [];
							
							// Add newline after opening brace
							fixes.push(fixer.insertTextAfter(openingBrace, `\n${indentation}`));
							
							// Also ensure closing brace is on its own line with proper indentation
							const lastStatement = blockStatement.body[blockStatement.body.length - 1];
							const lastToken = sourceCode.getLastToken(lastStatement);
							const closingBraceIndentation = '\t'.repeat(getIndentLevel(node) + 1);
							
							if (lastToken.loc.end.line === closingBrace.loc.start.line) {
								fixes.push(fixer.insertTextBefore(closingBrace, `\n${closingBraceIndentation}`));
							}
							
							return fixes;
						}
					});
				}
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