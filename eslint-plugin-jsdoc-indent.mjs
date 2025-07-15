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
						
						for (let i = 0; i < lines.length; i++) {
							const line = lines[i];
							
							// Skip the opening line (/**)
							if (i === 0) continue;
							
							// Handle different line types
							const trimmedLine = line.trim();
							
							// Lines without asterisks in JSDoc (like "Text" instead of "* Text")
							if (trimmedLine !== '' && !trimmedLine.startsWith('*') && !trimmedLine.endsWith('*/')) {
								// This line should have an asterisk added
								const start = comment.range[0] + 2; // +2 for "/*"
								let lineOffset = 0;
								for (let j = 0; j < i; j++) {
									lineOffset += lines[j].length + 1; // +1 for \n
								}
								
								context.report({
									node: comment,
									loc: {
										start: sourceCode.getLocFromIndex(start + lineOffset),
										end: sourceCode.getLocFromIndex(start + lineOffset + line.length)
									},
									message: `JSDoc comment should be properly aligned`,
									fix(fixer) {
										return fixer.replaceTextRange(
											[start + lineOffset, start + lineOffset + line.length], 
											baseIndent + ' * ' + trimmedLine
										);
									}
								});
							} else if (trimmedLine === '' || trimmedLine.startsWith('*')) {
								// Check indentation for lines with asterisks
								const leadingMatch = line.match(/^(\s*)/);
								if (!leadingMatch) continue;
								
								const leadingSpaces = leadingMatch[1];
								const isClosingLine = trimmedLine === '*/';
								const correctIndent = isClosingLine ? baseIndent : baseIndent + ' ';
								
								// Skip if already correct to avoid circular fixes
								if (leadingSpaces === correctIndent) continue;
								
								// Calculate the position in the original source
								const start = comment.range[0] + 2; // +2 for "/*"
								let lineOffset = 0;
								for (let j = 0; j < i; j++) {
									lineOffset += lines[j].length + 1; // +1 for \n
								}
								
								const lineStart = start + lineOffset;
								const lineEnd = lineStart + leadingSpaces.length;
								
								context.report({
									node: comment,
									loc: {
										start: sourceCode.getLocFromIndex(lineStart),
										end: sourceCode.getLocFromIndex(lineEnd)
									},
									message: `JSDoc comment should be properly aligned`,
									fix(fixer) {
										return fixer.replaceTextRange([lineStart, lineEnd], correctIndent);
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