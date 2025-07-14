
# @dmitryrechkin/eslint-standard

A comprehensive ESLint configuration package with TypeScript support, featuring **automatic formatting and code organization**. This configuration enforces consistent code style across projects with powerful auto-fixing capabilities for imports, class members, JSDoc comments, and more.

## ✨ Features

### **Auto-Fixing Capabilities**
- 🔄 **Automatic Import Sorting**: Organizes imports with type imports and regular imports properly grouped
- 🏗️ **Class Member Ordering**: Auto-reorders class members by visibility (public → protected → private) and type (fields → constructor → methods)
- 📝 **JSDoc Alignment**: Automatically fixes JSDoc comment indentation and alignment with proper tab formatting
- 🧹 **Unused Import Removal**: Automatically detects and removes unused imports

### **Code Style Enforcement**
- **TypeScript Support**: Full integration with `@typescript-eslint` for TypeScript-specific best practices
- **Modern JavaScript**: Supports ECMAScript 2020 and newer features
- **Consistent Formatting**: Enforces Allman brace style, tab indentation, single quotes, and semicolons
- **Naming Conventions**: Comprehensive naming rules for variables, functions, classes, and more
- **Customizable**: Flexible configuration options for different project needs

## 📦 Installation

### Install the Package and Peer Dependencies

```bash
npm install @dmitryrechkin/eslint-standard --save-dev
```

### Install Required Peer Dependencies

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports @stylistic/eslint-plugin eslint-plugin-jsdoc eslint-plugin-simple-import-sort eslint-plugin-perfectionist --save-dev
```

Or using a single command:
```bash
npm install @dmitryrechkin/eslint-standard eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports @stylistic/eslint-plugin eslint-plugin-jsdoc eslint-plugin-simple-import-sort eslint-plugin-perfectionist --save-dev
```

## 🚀 Usage

### ESLint 9+ Flat Config (Recommended)

Create an `eslint.config.mjs` file in your project root:

```javascript
import eslintStandard from '@dmitryrechkin/eslint-standard';

export default eslintStandard({
  tsconfigPath: './tsconfig.json', // Optional: specify path to your tsconfig
  files: ['**/*.{js,jsx,ts,tsx}'], // Optional: specify file patterns
  ignores: ['dist/**', 'node_modules/**'] // Optional: additional ignore patterns
});
```

### Advanced Configuration

```javascript
import eslintStandard from '@dmitryrechkin/eslint-standard';

export default eslintStandard({
  tsconfigPath: './tsconfig.json',
  files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
  ignores: ['dist/**', 'coverage/**'],
  plugins: {
    // Add custom plugins
  },
  rules: {
    // Override or add custom rules
    'no-console': 'warn',
    'perfectionist/sort-classes': 'off' // Disable auto class member sorting if needed
  }
});
```

### Multiple Configurations

```javascript
import eslintStandard from '@dmitryrechkin/eslint-standard';

export default [
  // Configuration for source files
  eslintStandard({
    tsconfigPath: './tsconfig.json',
    files: ['src/**/*.{ts,tsx}']
  }),
  
  // Configuration for test files with different rules
  eslintStandard({
    tsconfigPath: './tsconfig.json',
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off' // Allow console in tests
    }
  })
];
```

## 🛠️ Package.json Scripts

Add these scripts to your `package.json` for easy linting and formatting:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "eslint . --fix"
  }
}
```

### Usage Examples

```bash
# Check for linting errors
npm run lint

# Auto-fix all fixable issues (imports, member ordering, JSDoc alignment, etc.)
npm run lint:fix

# Same as lint:fix
npm run format
```

## 🎯 What Gets Auto-Fixed

When you run `eslint --fix`, this configuration will automatically:

1. **📤 Sort Imports**: Organize import statements with type imports grouped correctly
2. **🔄 Reorder Class Members**: Arrange class members by visibility and type:
   - Static properties → Instance properties → Constructor → Static methods → Instance methods
   - Within each group: public → protected → private
3. **📝 Fix JSDoc Indentation**: Align JSDoc comments with proper tab indentation
4. **🧹 Remove Unused Imports**: Clean up unused import statements
5. **✨ Format Code**: Apply consistent spacing, quotes, semicolons, and brace styles

## 📋 Code Style Overview

### 🔧 Formatting Rules

- **Brace Style**: Allman style (braces on new lines)
- **Indentation**: Tabs (configurable tab width)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at statement ends
- **Trailing Spaces**: Automatically removed

### 📝 Before and After Examples

#### Import Sorting
```typescript
// ❌ Before
import { TypeResponse } from '../types';
import type { SomeInterface } from './interfaces';
import { EnumErrorCode } from '../enums';
import type { BaseConfig } from '../config';

// ✅ After (auto-fixed)
import type { BaseConfig } from '../config';
import type { SomeInterface } from './interfaces';
import { EnumErrorCode } from '../enums';
import { TypeResponse } from '../types';
```

#### Class Member Ordering
```typescript
// ❌ Before
export class UserService
{
	private isInitialized = false;
	public static readonly VERSION = '1.0.0';
	public readonly name: string;
	
	private validateUser() { /* ... */ }
	public async getUser() { /* ... */ }
	public static getInstance() { /* ... */ }
	constructor(name: string) { /* ... */ }
}

// ✅ After (auto-fixed)
export class UserService
{
	public static readonly VERSION = '1.0.0';
	
	public readonly name: string;
	private isInitialized = false;
	
	constructor(name: string) { /* ... */ }
	
	public static getInstance() { /* ... */ }
	
	public async getUser() { /* ... */ }
	
	private validateUser() { /* ... */ }
}
```

#### JSDoc Alignment
```typescript
// ❌ Before
/**
   * Process user data
   * @param userData - The user data
   * @returns Processed result
   */

// ✅ After (auto-fixed)
/**
 * Process user data
 * @param userData - The user data
 * @returns Processed result
 */
```

### 🏷️ Naming Conventions

- **Variables & Functions**: `camelCase`
- **Classes & Interfaces**: `PascalCase`
- **Constants**: `UPPER_CASE` or `camelCase`
- **Enum Members**: `UPPER_CASE` or `PascalCase`
- **Type Parameters**: `PascalCase`

## ⚠️ Troubleshooting

### Peer Dependency Warnings

If you see peer dependency warnings, install all required dependencies:
```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports @stylistic/eslint-plugin eslint-plugin-jsdoc eslint-plugin-simple-import-sort eslint-plugin-perfectionist --save-dev
```

### ESLint Version Compatibility

This package requires **ESLint 9+** for flat config support. For older ESLint versions, please use an earlier version of this package.

### TypeScript Configuration

Ensure your `tsconfig.json` is properly configured and the path specified in `tsconfigPath` is correct.

## 🔧 Configuration Options

The configuration function accepts these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tsconfigPath` | `string` | `'./tsconfig.json'` | Path to your TypeScript config file |
| `files` | `string[]` | `['**/*.{js,jsx,ts,tsx}']` | File patterns to lint |
| `ignores` | `string[]` | `['node_modules/**', 'dist/**']` | Patterns to ignore |
| `plugins` | `object` | `{}` | Additional ESLint plugins |
| `rules` | `object` | `{}` | Additional or overridden rules |

## 📚 Plugin Documentation

This configuration uses several powerful ESLint plugins:

- **[@typescript-eslint](https://typescript-eslint.io/)**: TypeScript-specific linting rules
- **[eslint-plugin-perfectionist](https://perfectionist.dev/)**: Auto-sorting for classes, imports, and more
- **[eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)**: Simple and reliable import sorting
- **[@stylistic/eslint-plugin](https://eslint.style/)**: Stylistic formatting rules
- **[eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports)**: Automatic unused import removal

## 🤝 Contributing

Contributions to improve this ESLint configuration are welcome! Please feel free to:

- 🐛 [Report bugs](https://github.com/dmitryrechkin/eslint-standard/issues)
- 💡 [Suggest new features](https://github.com/dmitryrechkin/eslint-standard/issues)
- 🔧 [Submit pull requests](https://github.com/dmitryrechkin/eslint-standard/pulls)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.


