/**
 * Custom ESLint plugin to auto-fix JSDoc comment indentation and alignment
 */

const jsdocIndentRule = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce proper indentation and alignment in JSDoc comments',
			category: 'Stylistic Issues',
			recommended: false
		},
		fixable: 'whitespace',
		schema: [
			{
				type: 'object',
				properties: {
					tabWidth: {
						type: 'integer',
						minimum: 1,
						default: 4
					}
				},
				additionalProperties: false
			}
		]
	},

	create(context) {
		const options = context.options[0] || {};
		const tabWidth = options.tabWidth || 4;
		const sourceCode = context.sourceCode || context.getSourceCode();

		return {
			Program() {
				const comments = sourceCode.getAllComments();

				for (const comment of comments) {
					if (comment.type === 'Block' && comment.value.startsWith('*')) {
						// This is a JSDoc comment
						const lines = comment.value.split('\n');
						
						// Get the base indentation from the comment's position
						const commentLoc = sourceCode.getLocFromIndex(comment.range[0]);
						const commentLine = sourceCode.getLines()[commentLoc.line - 1];
						const baseIndentMatch = commentLine.match(/^(\s*)/);
						const baseIndent = baseIndentMatch ? baseIndentMatch[1] : '';
						
						for (let i = 1; i < lines.length; i++) { // Skip first line, include last line for closing */
							const line = lines[i];
							const leadingSpaces = line.match(/^( +)/);
							
							if (leadingSpaces) {
								// Check if this is the closing line (ends with */)
								const isClosingLine = line.trim() === '*/';
								
								// Calculate correct indentation
								const correctIndent = isClosingLine ? baseIndent : baseIndent + ' ';
								
								// Skip if already correct to avoid circular fixes
								if (isClosingLine && line.startsWith(correctIndent + '*/')) {
									continue;
								} else if (!isClosingLine && line.startsWith(correctIndent + '*')) {
									continue;
								}
								
								// Calculate the position in the original source
								const lineStart = comment.range[0] + 2; // +2 for "/*"
								let lineOffset = 0;
								for (let j = 0; j < i; j++) {
									lineOffset += lines[j].length + 1; // +1 for \n
								}
								
								const start = lineStart + lineOffset;
								const end = start + leadingSpaces[1].length;
								
								context.report({
									node: comment,
									loc: {
										start: sourceCode.getLocFromIndex(start),
										end: sourceCode.getLocFromIndex(end)
									},
									message: `JSDoc comment should be properly aligned`,
									fix(fixer) {
										return fixer.replaceTextRange([start, end], correctIndent);
									}
								});
							}
						}
					}
				}
			}
		};
	}
};

export default {
	rules: {
		'jsdoc-indent': jsdocIndentRule
	},
	configs: {
		recommended: {
			rules: {
				'jsdoc-indent/jsdoc-indent': ['error', { tabWidth: 4 }]
			}
		}
	}
};