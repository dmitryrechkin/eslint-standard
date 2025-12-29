# @dmitryrechkin/eslint-standard

A comprehensive ESLint configuration package with TypeScript support, featuring **Prettier integration with Allman brace style** and industry-standard rules for maximum code quality.

## 🚀 Quick Start

### Installation

```bash
npm install -D @dmitryrechkin/eslint-standard
npx @dmitryrechkin/eslint-standard install-deps
```

### Basic Usage

```javascript
// eslint.config.mjs
import config from '@dmitryrechkin/eslint-standard';

export default config({
	tsconfigPath: './tsconfig.json'
});
```

## 📋 Available Presets

### Standard (Default)
Balanced configuration suitable for most projects.

```javascript
import config from '@dmitryrechkin/eslint-standard';
export default config();
```

### Aggressive
Enhanced unused code detection for maximum code quality.

```javascript
import config from '@dmitryrechkin/eslint-standard/aggressive';
export default config();
```

**Features:**
- ✅ Enhanced unused variable detection
- ✅ Import/export cleanup  
- ✅ Dead code detection (unreachable code)
- ✅ Strict unused expressions rules
- ✅ TypeScript-specific cleanup

### Library
Optimized for TypeScript libraries with strict API requirements.

```javascript
import config from '@dmitryrechkin/eslint-standard/library';
export default config();
```

**Features:**
- ✅ Very strict unused exports detection
- ✅ API documentation requirements (JSDoc)
- ✅ Explicit return types
- ✅ No console/debugging code
- ✅ Enhanced type safety rules

### Strict Mode
Enterprise-grade architectural conventions for large-scale TypeScript monorepos. Enforces consistent project structure, naming conventions, and design patterns.

```javascript
import config from '@dmitryrechkin/eslint-standard';

export default config({
	strict: true,
	tsconfigPath: './tsconfig.json'
});
```

**Features:**
- ✅ Enforced folder structure (services/, repositories/, helpers/, etc.)
- ✅ Single Responsibility Principle for services and transformers
- ✅ CQRS pattern enforcement for repositories
- ✅ Static-only helpers, no static methods in other classes
- ✅ Consistent interface naming conventions
- ✅ One class per file

#### Strict Mode Rules

| Rule | Enforcement | Rationale |
|------|-------------|-----------|
| **Class Location** | `*Service` → `services/`, `*Repository` → `repositories/`, `*Helper` → `helpers/`, `*Factory` → `factories/`, `*Transformer` → `transformers/`, `*Registry` → `registries/`, `*Adapter` → `adapters/` | Predictable project structure enables faster navigation and onboarding |
| **Service Single Method** | Services must have only one public method | Single Responsibility Principle - each service does one thing well |
| **Transformer Single Method** | Transformers must have only one public method | Clear data transformation contracts |
| **Helper Static Only** | Helper classes must contain only static methods | Helpers are utility collections, not stateful objects |
| **No Static in Non-Helpers** | Non-helper/factory classes cannot have static methods | Prevents hidden global state, improves testability via dependency injection |
| **Type Location** | `interface TypeXXX` must be in `types/` folder | Centralized type definitions for reusability |
| **Interface Naming** | `TypeXXX` for data types, `XXXInterface` for class contracts | Clear distinction between data structures and behavioral contracts |
| **One Class Per File** | Each file can contain only one class | Simplifies imports, improves code organization |
| **Repository CQRS** | `CommandRepository` cannot have query methods (`get`, `find`, `list`), `QueryRepository` cannot have command methods (`create`, `update`, `delete`) | Command Query Responsibility Segregation for scalable data access |
| **Folder CamelCase** | All folder names must be camelCase | Consistent naming across the codebase |
| **Function Name Match Filename** | Top-level function name must match filename | Predictable imports and file discovery |

#### Example Project Structure

```
src/
├── services/
│   ├── UserService.ts          # class UserService { execute() }
│   └── PaymentService.ts       # class PaymentService { process() }
├── repositories/
│   ├── UserCommandRepository.ts # create(), update(), delete()
│   └── UserQueryRepository.ts   # find(), getById(), list()
├── helpers/
│   └── ValidationHelper.ts      # static validate(), static sanitize()
├── factories/
│   └── UserFactory.ts           # static create()
├── transformers/
│   └── UserTransformer.ts       # transform()
├── types/
│   ├── TypeUser.ts              # interface TypeUser { id: string }
│   └── TypePayment.ts           # interface TypePayment { amount: number }
└── adapters/
    └── StripeAdapter.ts         # class StripeAdapter
```

## ⚙️ Configuration Options

All configurations accept the same configuration options:

```javascript
export default config({
	tsconfigPath: './tsconfig.json',    // Path to TypeScript config
	ignores: ['build/**', 'dist/**'],   // Additional ignore patterns
	files: ['src/**/*'],                // File patterns to lint
	rules: {                           // Rule overrides
		'no-console': 'warn'
	}
});
```

## 🛠️ CLI Commands

The package includes a CLI for dependency management:

```bash
# Install all peer dependencies
npx @dmitryrechkin/eslint-standard install-deps

# Check if dependencies are installed
npx @dmitryrechkin/eslint-standard check-deps

# Auto-install missing dependencies
npx @dmitryrechkin/eslint-standard check-deps --install
```

## 🎯 Rule Categories

### Code Quality & Safety
- **Type Safety**: Strict TypeScript rules, ban `any` type
- **Error Prevention**: Catch common bugs and unsafe patterns
- **Security**: Prevent common security vulnerabilities
- **Performance**: Avoid performance anti-patterns

### Code Style & Formatting
- **Prettier Integration**: Automatic code formatting with industry-standard plugins
- **Brace Style**: Allman style (braces on new lines) via `prettier-plugin-brace-style`
- **Indentation**: Tabs (4-space width) for accessibility and user preference
- **Quotes**: Single quotes for consistency
- **Import Organization**: Automatic import sorting and grouping
- **JSDoc**: Required documentation with proper alignment and formatting

### Code Complexity & Architecture
- **Function Complexity**: Max 10 cyclomatic complexity (industry standard)
- **Cognitive Complexity**: Max 15 (SonarJS) for maintainable code
- **Function Length**: Max 100 lines (300 for tests) following clean code principles
- **File Length**: Max 300 lines (500 for tests) for focused modules
- **Function Parameters**: Max 7 parameters (allows dependency injection patterns)
- **Nesting Depth**: Max 3 levels to prevent callback hell

### Modern JavaScript/TypeScript
- **ES2020+ Features**: Prefer modern syntax and APIs
- **Functional Programming**: Pragmatic immutability patterns
- **Promise Handling**: Proper async/await usage
- **Import/Export**: Clean module system usage

## 📊 Preset Comparison

| Feature | Standard | Aggressive | Library | Strict Mode |
|---------|----------|------------|---------|-------------|
| Unused imports cleanup | ✅ | ✅ | ✅ | ✅ |
| Unused variables detection | Basic | Enhanced | Enhanced | Basic |
| Dead code detection | Basic | ✅ | ✅ | Basic |
| Unused exports check | ❌ | ✅ | Very Strict | ❌ |
| JSDoc requirements | Basic | Basic | Strict | Basic |
| Console statements | Warning | Warning | Error | Warning |
| Return type hints | Error | Error | Explicit | Error |
| Type safety | High | High | Very High | High |
| Folder structure enforcement | ❌ | ❌ | ❌ | ✅ |
| Single Responsibility (Services) | ❌ | ❌ | ❌ | ✅ |
| CQRS Repository pattern | ❌ | ❌ | ❌ | ✅ |
| Interface naming conventions | ❌ | ❌ | ❌ | ✅ |
| One class per file | ❌ | ❌ | ❌ | ✅ |
| Static method restrictions | ❌ | ❌ | ❌ | ✅ |

## 📈 Industry Standards Comparison

| Metric | This Package | Google | Airbnb | SonarQube | Clean Code |
|--------|--------------|--------|---------|-----------|------------|
| Max Parameters | 7 | 4 | No limit* | 7 | 3-4 |
| Max Function Lines | 100 | 50 | No limit | 200 | 20 |
| Max File Lines | 300 | 2000 | 2500 | 1000 | 300 |
| Cyclomatic Complexity | 10 | 10 | No limit | 10 | 5-10 |
| Max Nesting | 3 levels | 3 levels | No limit | 3 levels | 2-3 levels |
| Brace Style | Allman | 1TBS | 1TBS | Configurable | Any |
| Indentation | Tabs (4) | Spaces (2) | Spaces (2) | Configurable | Spaces (4) |

*Airbnb recommends objects for >3 parameters

## 🎨 Prettier Integration Features

This package includes seamless **Prettier integration** that handles all formatting automatically:

### Supported File Types
- **TypeScript/JavaScript**: `.ts`, `.js`, `.tsx`, `.jsx` with Allman brace style
- **Astro**: `.astro` files with optimized formatting via `prettier-plugin-astro`

### Automatic Formatting
- **Allman Brace Style**: All braces on new lines for maximum readability
- **Single Quotes**: Consistent string quoting throughout codebase  
- **Tab Indentation**: Accessible indentation with 4-space tab width
- **Semicolons**: Always required for statement clarity
- **No Trailing Commas**: Clean object/array formatting

### ESLint-Prettier Harmony
- All conflicting ESLint formatting rules are **automatically disabled**
- Prettier handles formatting, ESLint handles code quality
- **No configuration conflicts** - works out of the box

## 🔧 External Tools Integration

For comprehensive unused code detection, consider these additional tools:

```bash
# Find unused exports
npx ts-prune

# Find unused files  
npx unimported

# Advanced dead code analysis
npx knip

# Find unused dependencies
npx depcheck
```

## 🚦 Usage Recommendations

### For Applications
Use **Standard** preset - provides good balance of strictness and practicality.

### For Libraries
Use **Library** preset - ensures clean public APIs and comprehensive documentation.

### For Maximum Code Quality
Use **Aggressive** preset - comprehensive unused code detection.

### For Enterprise Monorepos
Use **Strict Mode** - enforces architectural conventions, folder structure, and design patterns for large teams.

## 🔍 Example Projects

### React Application
```javascript
// eslint.config.mjs
import config from '@dmitryrechkin/eslint-standard';

export default config({
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'build/**', 'public/**']
});
```

### TypeScript Library
```javascript
// eslint.config.mjs
import config from '@dmitryrechkin/eslint-standard/library';

export default config({
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'examples/**']
});
```

### Node.js API
```javascript
// eslint.config.mjs
import config from '@dmitryrechkin/eslint-standard/aggressive';

export default config({
	tsconfigPath: './tsconfig.json',
	rules: {
		'no-console': 'off', // Allow console in Node.js
	}
});
```

### Enterprise Monorepo
```javascript
// eslint.config.mjs
import config from '@dmitryrechkin/eslint-standard';

export default config({
	strict: true,
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'node_modules/**']
});
```

## 🤝 Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/dmitryrechkin/eslint-standard).

## 📄 License

MIT License - see LICENSE file for details.