# @dmitryrechkin/eslint-standard

A comprehensive ESLint configuration package with TypeScript support, featuring Prettier integration and industry-standard rules.

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
- **Brace Style**: Allman style (braces on new lines) via Prettier
- **Indentation**: Tabs with consistent spacing
- **Import Organization**: Automatic import sorting and grouping
- **JSDoc**: Required documentation with proper formatting

### Modern JavaScript/TypeScript
- **ES2020+ Features**: Prefer modern syntax and APIs
- **Functional Programming**: Pragmatic immutability patterns
- **Promise Handling**: Proper async/await usage
- **Import/Export**: Clean module system usage

## 📊 Preset Comparison

| Feature | Standard | Aggressive | Library |
|---------|----------|------------|---------|
| Unused imports cleanup | ✅ | ✅ | ✅ |
| Unused variables detection | Basic | Enhanced | Enhanced |
| Dead code detection | Basic | ✅ | ✅ |
| Unused exports check | ❌ | ✅ | Very Strict |
| JSDoc requirements | Basic | Basic | Strict |
| Console statements | Warning | Warning | Error |
| Return type hints | Error | Error | Explicit |
| Type safety | High | High | Very High |

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

## 🤝 Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/dmitryrechkin/eslint-standard).

## 📄 License

MIT License - see LICENSE file for details.