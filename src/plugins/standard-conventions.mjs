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
/**
 * Rule: Factories must have only one public method
 * @type {import('eslint').Rule.RuleModule}
 */
const factorySinglePublicMethodRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that factories have only one public method',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!node.id || !node.id.name.endsWith('Factory')) {
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
						message: 'Factory {{ name }} has {{ count }} public methods. Factories should have only one public method.',
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

				// Allow static methods in Helpers, Factories, and Registries
				if (className.endsWith('Helper') || className.endsWith('Factory') || className.endsWith('Registry')) {
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

/**
 * Rule: No Zod schemas in files with classes
 * @type {import('eslint').Rule.RuleModule}
 */
const noSchemasInClassFilesRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce separation of schemas from class files',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		let hasClass = false;
		const schemas = [];

		return {
			ClassDeclaration() {
				hasClass = true;
			},
			VariableDeclarator(node) {
				if (node.id.type === 'Identifier') {
					const name = node.id.name;
					// Check for Schema suffix or z.object/z.string initialization
					const isSchemaName = name.endsWith('Schema');
					let isZodInit = false;

					if (node.init && node.init.type === 'CallExpression' &&
						node.init.callee.type === 'MemberExpression' &&
						node.init.callee.object.type === 'Identifier' &&
						node.init.callee.object.name === 'z') {
						isZodInit = true;
					}

					if (isSchemaName || isZodInit) {
						// Check if top-level
						if (node.parent.parent.type === 'Program' ||
							(node.parent.parent.type === 'ExportNamedDeclaration' && node.parent.parent.parent.type === 'Program')) {
							schemas.push(node);
						}
					}
				}
			},
			'Program:exit'() {
				if (hasClass && schemas.length > 0) {
					schemas.forEach(node => {
						context.report({
							node: node.id,
							message: 'Schema definition "{{ name }}" should not be in a class file. Move it to a separate schemas file or folder.',
							data: {
								name: node.id.name
							}
						});
					});
				}
			}
		};
	}
};

/**
 * Rule: No types/interfaces in files with classes
 * @type {import('eslint').Rule.RuleModule}
 */
const noTypesInClassFilesRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce separation of types and interfaces from class files',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		let hasClass = false;
		const types = [];

		return {
			ClassDeclaration() {
				hasClass = true;
			},
			TSTypeAliasDeclaration(node) {
				if (node.parent.type === 'Program' ||
					(node.parent.type === 'ExportNamedDeclaration' && node.parent.parent.type === 'Program')) {
					types.push(node);
				}
			},
			TSInterfaceDeclaration(node) {
				if (node.parent.type === 'Program' ||
					(node.parent.type === 'ExportNamedDeclaration' && node.parent.parent.type === 'Program')) {
					types.push(node);
				}
			},
			'Program:exit'() {
				if (hasClass && types.length > 0) {
					types.forEach(node => {
						context.report({
							node: node.id,
							message: 'Type/Interface definition "{{ name }}" should not be in a class file. Move it to a separate types file or folder.',
							data: {
								name: node.id.name
							}
						});
					});
				}
			}
		};
	}
};

/**
 * Rule: No top-level constants in files with classes
 * @type {import('eslint').Rule.RuleModule}
 */
const noConstantsInClassFilesRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce separation of constants from class files',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		let hasClass = false;
		const constants = [];

		return {
			ClassDeclaration() {
				hasClass = true;
			},
			VariableDeclaration(node) {
				// Check if top-level const
				if (node.kind === 'const' &&
					(node.parent.type === 'Program' ||
					(node.parent.type === 'ExportNamedDeclaration' && node.parent.parent.type === 'Program'))) {

					node.declarations.forEach(decl => {
						// Skip requires
						if (decl.init && decl.init.type === 'CallExpression' && decl.init.callee.name === 'require') {
							return;
						}
						// Skip Zod schemas (covered by other rule)
						if (decl.id.name && decl.id.name.endsWith('Schema')) {
							return;
						}
						if (decl.init && decl.init.type === 'CallExpression' &&
							decl.init.callee.type === 'MemberExpression' &&
							decl.init.callee.object.name === 'z') {
							return;
						}

						constants.push(decl);
					});
				}
			},
			'Program:exit'() {
				if (hasClass && constants.length > 0) {
					constants.forEach(node => {
						context.report({
							node: node.id,
							message: 'Constant "{{ name }}" should not be in a class file. Move it to a separate constants file or use a static readonly class property.',
							data: {
								name: node.id.name
							}
						});
					});
				}
			}
		};
	}
};

/**
 * Rule: Interfaces must start with Type or end with Interface
 * @type {import('eslint').Rule.RuleModule}
 */
const interfaceNamingRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that interface names start with Type or end with Interface',
			category: 'Naming Conventions',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			TSInterfaceDeclaration(node) {
				if (!node.id) return;
				const name = node.id.name;
				if (!name.startsWith('Type') && !name.endsWith('Interface')) {
					context.report({
						node: node.id,
						message: 'Interface "{{ name }}" should start with "Type" (for data) or end with "Interface" (for contracts).',
						data: { name }
					});
				}
			}
		};
	}
};

/**
 * Rule: Functions must have explicit return types
 * @type {import('eslint').Rule.RuleModule}
 */
const explicitReturnTypeRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce explicit return types for functions',
			category: 'Type Safety',
			recommended: false
		},
		schema: []
	},
	create(context) {
		function checkFunction(node) {
			if (!node.returnType) {
				const name = node.id ? node.id.name : (node.key ? node.key.name : 'anonymous');
				context.report({
					node: node.id || node.key || node,
					message: 'Function/Method "{{ name }}" is missing an explicit return type.',
					data: { name }
				});
			}
		}

		return {
			FunctionDeclaration: checkFunction,
			MethodDefinition: (node) => {
				if (node.kind === 'constructor' || node.kind === 'set') return;
				checkFunction(node.value);
			},
			ArrowFunctionExpression: checkFunction,
			FunctionExpression: (node) => {
				if (node.parent.type === 'MethodDefinition') return;
				checkFunction(node);
			}
		};
	}
};

/**
 * Rule: No direct instantiation of classes inside other classes (dependency injection)
 * @type {import('eslint').Rule.RuleModule}
 */
const noDirectInstantiationRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce dependency injection by banning direct instantiation',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		const allowedClasses = new Set([
			'Date', 'Error', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
			'RegExp', 'URL', 'URLSearchParams', 'Buffer', 'Array', 'Object', 'String', 'Number', 'Boolean'
		]);

		let inClass = false;
		let currentClassName = '';

		return {
			ClassDeclaration(node) {
				inClass = true;
				if (node.id) {
					currentClassName = node.id.name;
				}
			},
			'ClassDeclaration:exit'() {
				inClass = false;
				currentClassName = '';
			},
			NewExpression(node) {
				if (!inClass) return;

				// Allow factories to instantiate objects
				if (currentClassName.endsWith('Factory')) {
					return;
				}

				if (node.callee.type === 'Identifier') {
					const className = node.callee.name;
					if (!allowedClasses.has(className)) {
						context.report({
							node: node,
							message: 'Avoid direct instantiation of "{{ name }}". Use dependency injection instead.',
							data: { name: className }
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Prefer Enums over union types of string literals
 * @type {import('eslint').Rule.RuleModule}
 */
const preferEnumsRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Prefer Enums over union types of string literals',
			category: 'TypeScript',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			TSTypeAliasDeclaration(node) {
				if (node.typeAnnotation.type === 'TSUnionType') {
					const isAllLiterals = node.typeAnnotation.types.every(
						t => t.type === 'TSLiteralType' && (typeof t.literal.value === 'string' || typeof t.literal.value === 'number')
					);

					if (isAllLiterals && node.typeAnnotation.types.length > 1) {
						context.report({
							node: node.id,
							message: 'Avoid union types for "{{ name }}". Use an Enum instead.',
							data: { name: node.id.name }
						});
					}
				}
			}
		};
	}
};

/**
 * Rule: Schemas must end with Schema or Table
 * @type {import('eslint').Rule.RuleModule}
 */
const schemaNamingRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that Zod schemas and Drizzle tables end with Schema or Table',
			category: 'Naming Conventions',
			recommended: false
		},
		schema: []
	},
	create(context) {
		return {
			VariableDeclarator(node) {
				if (node.init && node.init.type === 'CallExpression') {
					let isZodOrDrizzle = false;

					// Check for z.something()
					if (node.init.callee.type === 'MemberExpression' &&
						node.init.callee.object.type === 'Identifier' &&
						node.init.callee.object.name === 'z') {
						isZodOrDrizzle = true;
					}

					// Check for pgTable()
					if (node.init.callee.type === 'Identifier' && node.init.callee.name === 'pgTable') {
						isZodOrDrizzle = true;
					}

					if (isZodOrDrizzle && node.id.type === 'Identifier') {
						const name = node.id.name;
						if (!name.endsWith('Schema') && !name.endsWith('Table')) {
							context.report({
								node: node.id,
								message: 'Schema/Table definition "{{ name }}" should end with "Schema" or "Table".',
								data: { name }
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
		'factory-single-public-method': factorySinglePublicMethodRule,
		'function-name-match-filename': functionNameMatchFilenameRule,
		'folder-camel-case': folderCamelCaseRule,
		'helper-static-only': helperStaticOnlyRule,
		'no-static-in-non-helpers': noStaticInNonHelpersRule,
		'class-location': classLocationRule,
		'type-location': typeLocationRule,
		'transformer-single-public-method': transformerSinglePublicMethodRule,
		'one-class-per-file': oneClassPerFileRule,
		'repository-cqrs': repositoryCqrsRule,
		'no-schemas-in-class-files': noSchemasInClassFilesRule,
		'no-types-in-class-files': noTypesInClassFilesRule,
		'no-constants-in-class-files': noConstantsInClassFilesRule,
		'interface-naming': interfaceNamingRule,
		'explicit-return-type': explicitReturnTypeRule,
		'no-direct-instantiation': noDirectInstantiationRule,
		'prefer-enums': preferEnumsRule,
		'schema-naming': schemaNamingRule
	}
};
