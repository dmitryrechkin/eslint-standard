import path from 'node:path';

/**
 * Rule: Services must have only one public method
 * @type {import('eslint').Rule.RuleModule}
 */
const serviceSinglePublicMethodRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that services have only one public method',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!node.id || !node.id.name.endsWith('Service')) {
					return;
				}

				const publicMethods = node.body.body.filter(member => {
					return (
						member.type === 'MethodDefinition' &&
						member.kind === 'method' &&
						(member.accessibility === 'public' || !member.accessibility) &&
						!member.static
					);
				});

				if (publicMethods.length > 1) {
					context.report({
						node: node.id,
						message: 'Service {{ name }} has {{ count }} public methods. Services should have only one public method.',
						data: {
							name: node.id.name,
							count: publicMethods.length
						}
					});
				}
			}
		};
	}
};

/**
 * Rule: Top-level function name must match filename
 * @type {import('eslint').Rule.RuleModule}
 */
const functionNameMatchFilenameRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that top-level function name matches filename',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		const filename = path.basename(context.getFilename(), path.extname(context.getFilename()));

		return {
			FunctionDeclaration(node) {
				// Only check top-level functions or functions inside exports
				const isTopLevel = node.parent.type === 'Program' ||
					(node.parent.type === 'ExportNamedDeclaration' && node.parent.parent.type === 'Program') ||
					(node.parent.type === 'ExportDefaultDeclaration' && node.parent.parent.type === 'Program');

				if (!isTopLevel) {
					return;
				}

				if (node.id && node.id.name !== filename) {
					// Special case: ignore if filename is 'index'
					if (filename === 'index') {
						return;
					}

					context.report({
						node: node.id,
						message: 'Function name "{{ name }}" does not match filename "{{ filename }}".',
						data: {
							name: node.id.name,
							filename: filename
						}
					});
				}
			}
		};
	}
};

/**
 * Rule: Folder names must be camelCase
 * @type {import('eslint').Rule.RuleModule}
 */
const folderCamelCaseRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that folder names are camelCase',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			Program() {
				const fullPath = context.getFilename();

				if (fullPath === '<input>' || fullPath === '<text>') {
					return;
				}

				const dirPath = path.dirname(fullPath);
				const relativePath = path.relative(process.cwd(), dirPath);

				if (!relativePath || relativePath === '.') {
					return;
				}

				const folders = relativePath.split(path.sep);
				const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;

				for (const folder of folders) {
					// Skip node_modules, dist, tests, and hidden folders
					if (folder === 'node_modules' || folder === 'dist' || folder === 'tests' || folder.startsWith('.')) {
						continue;
					}

					// Skip common top-level folders that might not be camelCase (optional, but good for compatibility)
					if (['src', 'apps', 'packages', 'tools', 'docs', 'config'].includes(folder)) {
						continue;
					}

					if (!camelCaseRegex.test(folder)) {
						context.report({
							loc: { line: 1, column: 0 },
							message: 'Folder name "{{ folder }}" should be camelCase.',
							data: { folder }
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Helpers must have only static methods
 * @type {import('eslint').Rule.RuleModule}
 */
const helperStaticOnlyRule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce that Helper classes only contain static methods',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!node.id || !node.id.name.endsWith('Helper')) {
					return;
				}

				const nonStaticMembers = node.body.body.filter(member => {
					// Skip constructors
					if (member.type === 'MethodDefinition' && member.kind === 'constructor') {
						return false;
					}

					// Check for non-static methods and properties
					return (
						(member.type === 'MethodDefinition' || member.type === 'PropertyDefinition') &&
						!member.static
					);
				});

				if (nonStaticMembers.length > 0) {
					for (const member of nonStaticMembers) {
						const memberName = member.key?.name || 'unknown';

						context.report({
							node: member,
							message: 'Helper class "{{ className }}" should only have static members. Member "{{ memberName }}" is not static.',
							data: {
								className: node.id.name,
								memberName
							}
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Non-helper classes should not have static methods (except factories)
 * @type {import('eslint').Rule.RuleModule}
 */
const noStaticInNonHelpersRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that non-Helper/Factory classes do not have static methods',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!node.id) {
					return;
				}

				const className = node.id.name;

				// Allow static methods in Helpers and Factories
				if (className.endsWith('Helper') || className.endsWith('Factory')) {
					return;
				}

				const staticMembers = node.body.body.filter(member => {
					return (
						(member.type === 'MethodDefinition' || member.type === 'PropertyDefinition') &&
						member.static
					);
				});

				if (staticMembers.length > 0) {
					for (const member of staticMembers) {
						const memberName = member.key?.name || 'unknown';

						context.report({
							node: member,
							message: 'Class "{{ className }}" should not have static members. Use a Helper class for static methods. Static member: "{{ memberName }}".',
							data: {
								className,
								memberName
							}
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Classes must be in appropriate folders based on their suffix
 * @type {import('eslint').Rule.RuleModule}
 */
const classLocationRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that classes are located in appropriate folders based on their suffix',
			category: 'Best Practices',
			recommended: false
		},
		schema: [
			{
				type: 'object',
				properties: {
					mappings: {
						type: 'object',
						additionalProperties: {
							type: 'string'
						}
					}
				},
				additionalProperties: false
			}
		]
	},
	create(context) {
		const options = context.options[0] || {};
		const defaultMappings = {
			Service: 'services',
			Repository: 'repositories',
			Helper: 'helpers',
			Factory: 'factories',
			Transformer: 'transformers',
			Registry: 'registries',
			Adapter: 'adapters'
		};
		const mappings = { ...defaultMappings, ...options.mappings };

		return {
			ClassDeclaration(node) {
				if (!node.id) {
					return;
				}

				const className = node.id.name;
				const fullPath = context.getFilename();

				if (fullPath === '<input>' || fullPath === '<text>') {
					return;
				}

				const dirPath = path.dirname(fullPath);

				for (const [suffix, expectedFolder] of Object.entries(mappings)) {
					if (className.endsWith(suffix)) {
						// Check if the file is in the expected folder or a subfolder
						const pathParts = dirPath.split(path.sep);

						if (!pathParts.includes(expectedFolder)) {
							context.report({
								node: node.id,
								message: 'Class "{{ className }}" with suffix "{{ suffix }}" should be in a "{{ expectedFolder }}" folder.',
								data: {
									className,
									suffix,
									expectedFolder
								}
							});
						}

						break; // Only check first matching suffix
					}
				}
			}
		};
	}
};

/**
 * Rule: Interface files with TypeXXX must be in types folder
 * @type {import('eslint').Rule.RuleModule}
 */
const typeLocationRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that Type interfaces are located in types folder',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			TSInterfaceDeclaration(node) {
				if (!node.id) {
					return;
				}

				const interfaceName = node.id.name;

				// Check if it's a Type interface (starts with Type)
				if (!interfaceName.startsWith('Type')) {
					return;
				}

				const fullPath = context.getFilename();

				if (fullPath === '<input>' || fullPath === '<text>') {
					return;
				}

				const dirPath = path.dirname(fullPath);
				const pathParts = dirPath.split(path.sep);

				if (!pathParts.includes('types')) {
					context.report({
						node: node.id,
						message: 'Type interface "{{ interfaceName }}" should be in a "types" folder.',
						data: { interfaceName }
					});
				}
			},
			TSTypeAliasDeclaration(node) {
				if (!node.id) {
					return;
				}

				const typeName = node.id.name;

				// Check if it's a Type alias (starts with Type)
				if (!typeName.startsWith('Type')) {
					return;
				}

				const fullPath = context.getFilename();

				if (fullPath === '<input>' || fullPath === '<text>') {
					return;
				}

				const dirPath = path.dirname(fullPath);
				const pathParts = dirPath.split(path.sep);

				if (!pathParts.includes('types')) {
					context.report({
						node: node.id,
						message: 'Type alias "{{ typeName }}" should be in a "types" folder.',
						data: { typeName }
					});
				}
			}
		};
	}
};

/**
 * Rule: Transformers must have single public method
 * @type {import('eslint').Rule.RuleModule}
 */
const transformerSinglePublicMethodRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that transformers have only one public method',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!node.id || !node.id.name.endsWith('Transformer')) {
					return;
				}

				const publicMethods = node.body.body.filter(member => {
					return (
						member.type === 'MethodDefinition' &&
						member.kind === 'method' &&
						(member.accessibility === 'public' || !member.accessibility) &&
						!member.static
					);
				});

				if (publicMethods.length > 1) {
					context.report({
						node: node.id,
						message: 'Transformer {{ name }} has {{ count }} public methods. Transformers should have only one public method.',
						data: {
							name: node.id.name,
							count: publicMethods.length
						}
					});
				}
			}
		};
	}
};

/**
 * Rule: Only one class per file
 * @type {import('eslint').Rule.RuleModule}
 */
const oneClassPerFileRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that each file contains only one class',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		const classes = [];

		return {
			ClassDeclaration(node) {
				if (node.id) {
					classes.push(node);
				}
			},
			'Program:exit'() {
				if (classes.length > 1) {
					// Report on all classes except the first one
					for (let idx = 1; idx < classes.length; idx++) {
						context.report({
							node: classes[idx].id,
							message: 'File contains multiple classes. Each class should be in its own file. Found {{ count }} classes.',
							data: {
								count: classes.length
							}
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Repository CQRS method naming
 * @type {import('eslint').Rule.RuleModule}
 */
const repositoryCqrsRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce CQRS naming for repository classes (CommandRepository vs QueryRepository)',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		const commandMethods = ['create', 'update', 'delete', 'save', 'insert', 'remove', 'add', 'set'];
		const queryMethods = ['get', 'find', 'fetch', 'list', 'search', 'query', 'read', 'load', 'retrieve'];

		return {
			ClassDeclaration(node) {
				if (!node.id) {
					return;
				}

				const className = node.id.name;

				// Only check Repository classes
				if (!className.endsWith('Repository')) {
					return;
				}

				const isCommandRepository = className.includes('Command');
				const isQueryRepository = className.includes('Query');

				// If not explicitly typed, skip this check (backward compatibility)
				if (!isCommandRepository && !isQueryRepository) {
					return;
				}

				const publicMethods = node.body.body.filter(member => {
					return (
						member.type === 'MethodDefinition' &&
						member.kind === 'method' &&
						(member.accessibility === 'public' || !member.accessibility) &&
						!member.static &&
						member.key?.name
					);
				});

				for (const method of publicMethods) {
					const methodName = method.key.name.toLowerCase();

					if (isCommandRepository) {
						// Command repositories should not have query methods
						const hasQueryMethod = queryMethods.some(queryMethod => methodName.startsWith(queryMethod));

						if (hasQueryMethod) {
							context.report({
								node: method.key,
								message: 'CommandRepository "{{ className }}" should not have query method "{{ methodName }}". Use a QueryRepository for read operations.',
								data: {
									className,
									methodName: method.key.name
								}
							});
						}
					}
					else if (isQueryRepository) {
						// Query repositories should not have command methods
						const hasCommandMethod = commandMethods.some(cmdMethod => methodName.startsWith(cmdMethod));

						if (hasCommandMethod) {
							context.report({
								node: method.key,
								message: 'QueryRepository "{{ className }}" should not have command method "{{ methodName }}". Use a CommandRepository for write operations.',
								data: {
									className,
									methodName: method.key.name
								}
							});
						}
					}
				}
			}
		};
	}
};

export default {
	rules: {
		'service-single-public-method': serviceSinglePublicMethodRule,
		'function-name-match-filename': functionNameMatchFilenameRule,
		'folder-camel-case': folderCamelCaseRule,
		'helper-static-only': helperStaticOnlyRule,
		'no-static-in-non-helpers': noStaticInNonHelpersRule,
		'class-location': classLocationRule,
		'type-location': typeLocationRule,
		'transformer-single-public-method': transformerSinglePublicMethodRule,
		'one-class-per-file': oneClassPerFileRule,
		'repository-cqrs': repositoryCqrsRule
	}
};
