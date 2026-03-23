# 🧹 Aggressive Unused Code Detection & Cleanup

This document explains how to configure and use aggressive unused code detection in the base ESLint standard package, going beyond basic ESLint capabilities to provide comprehensive dead code elimination.

## 🚀 Quick Start

### 1. Enable Aggressive Mode in ESLint Config

```javascript
// eslint.config.mjs
import baseConfig from '@dmitryrechkin/eslint-standard';

export default baseConfig({
	aggressiveCleanup: true, // 🔥 Enable aggressive mode
	tsconfigPath: './tsconfig.json',
	ignores: ['dist/**', 'build/**']
});
```

### 2. Set Up External Tools (One-time setup)

```bash
# Complete setup with external tools
npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup

# Or with pnpm
npx @dmitryrechkin/eslint-standard setup-aggressive-cleanup -p pnpm
```

### 3. Start Cleaning Up

```bash
# Check what unused code exists
npm run cleanup:check

# Fix unused imports and run lint
npm run cleanup:fix

# Comprehensive cleanup report
npm run cleanup:report
```

## 🎯 What Gets Detected & Fixed

### ✅ Auto-Fixed by ESLint

| Rule | Description | Auto-Fix |
|------|-------------|----------|
| `unused-imports/no-unused-imports` | Remove unused imports | ✅ |
| `unused-imports/no-unused-vars` | Enhanced unused variable detection | ❌ (detected only) |
| `@typescript-eslint/no-unused-vars` | TypeScript unused variables | ❌ (detected only) |
| `no-unused-expressions` | Remove side-effect free expressions | ❌ (detected only) |
| `no-unreachable` | Dead code after return/throw | ❌ (detected only) |
| `prettier/prettier` | Code formatting cleanup | ✅ |

### 🔍 Detected by External Tools

| Tool | Description | Purpose |
|------|-------------|---------|
| `ts-prune` | Find unused exports | Find dead exports across project |
| `unimported` | Find unused files | Find completely unused files |
| `knip` | Advanced dead code analysis | Comprehensive project analysis |
| `depcheck` | Find unused dependencies | Clean up package.json |
| `ts-remove-unused` | Remove unused imports | Standalone import cleaner |

## 📋 Aggressive Rules Configuration

When `aggressiveCleanup: true` is enabled, these additional rules are activated:

### Enhanced Unused Variable Detection
```javascript
'@typescript-eslint/no-unused-vars': ['error', {
	vars: 'all',
	args: 'after-used',
	argsIgnorePattern: '^_',
	varsIgnorePattern: '^_', 
	caughtErrors: 'all',
	destructuredArrayIgnorePattern: '^_'
}]
```

### Dead Code Detection
```javascript
'no-unreachable': 'error',
'no-unreachable-loop': 'error',
'no-unused-expressions': ['error', {
	allowShortCircuit: false,
	allowTernary: false,
	enforceForJSX: true
}]
```

### Import/Export Cleanup
```javascript
'import/no-unused-modules': ['error', {
	unusedExports: true,
	src: ['src/**/*'],
	ignoreExports: ['**/index.{js,ts}', '**/*.d.ts']
}]
```

### TypeScript-Specific Cleanup
```javascript
'@typescript-eslint/prefer-unknown-over-any': 'warn',
'@typescript-eslint/ban-ts-comment': ['error', {
	'ts-ignore': false, // Ban completely
	'ts-expect-error': 'allow-with-description'
}]
```

## 🛠️ Advanced Configuration Examples

### Gradual Adoption Strategy
Start with warnings to see what would be caught:

```javascript
import baseConfig from '@dmitryrechkin/eslint-standard';

export default baseConfig({
	aggressiveCleanup: true,
	rules: {
		// Start with warnings
		'import/no-unused-modules': 'warn',
		'unicorn/no-unused-properties': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
	}
});
```

### Library vs Application Configuration

#### For Libraries (Strict exports)
```javascript
export default baseConfig({
	aggressiveCleanup: true,
	rules: {
		'import/no-unused-modules': ['error', {
			unusedExports: true,
			src: ['src/**/*'],
			ignoreExports: ['**/index.{js,ts}'] // Only ignore barrel exports
		}]
	}
});
```

#### For Applications (Lenient exports)
```javascript
export default baseConfig({
	aggressiveCleanup: true,
	rules: {
		'import/no-unused-modules': ['warn', {
			unusedExports: true,
			ignoreExports: [
				'**/index.{js,ts}',
				'**/main.{js,ts}',
				'**/*.config.{js,ts}'
			]
		}]
	}
});
```

## 🔧 TypeScript Configuration for Optimal Detection

The setup command creates an optimal `tsconfig.json`:

```json
{
	"compilerOptions": {
		// Enhanced unused code detection
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"exactOptionalPropertyTypes": true,
		"noImplicitReturns": true,
		"allowUnreachableCode": false,
		"allowUnusedLabels": false,
		
		// Strict type checking
		"strict": true,
		"noImplicitAny": true,
		"useUnknownInCatchVariables": true
	}
}
```

## 📊 External Tools Usage

### ts-prune - Find Unused Exports
```bash
npx ts-prune

# Example output:
# src/utils/helper.ts:15 - formatDate
# src/components/Button.ts:8 - ButtonVariant (used in module)
```

### unimported - Find Unused Files
```bash  
npx unimported

# Example output:
# These files are not imported by any other files:
# - src/legacy/old-utils.ts
# - src/unused-component.tsx
```

### knip - Advanced Dead Code Analysis
```bash
npx knip

# Example output:
# Unused files (2):
# - src/legacy/old-utils.ts
# - test-utils.ts
#
# Unused exports (4):
# - formatDate in src/utils/helper.ts:15:1
# - ButtonVariant in src/components/Button.ts:8:1
```

### depcheck - Find Unused Dependencies
```bash
npx depcheck

# Example output:
# Unused dependencies:
# * lodash
# * moment
#
# Missing dependencies:
# * react (imported in src/App.tsx)
```

## 🎯 Integration with CI/CD

### Prevent Unused Code in CI
```yaml
# .github/workflows/ci.yml
- name: Check for unused code
  run: |
    npm run cleanup:check
    npm run lint
    
- name: Fail on unused exports (libraries only)
  run: npx ts-prune --error
```

### Pre-commit Hook
```json
{
	"husky": {
		"hooks": {
			"pre-commit": "npm run cleanup:fix && git add ."
		}
	}
}
```

## 🚨 Important Considerations

### When to Use Aggressive Mode

✅ **Good for:**
- New projects starting fresh
- Libraries with well-defined APIs
- Projects with comprehensive test coverage
- Refactoring legacy codebases

❌ **Be careful with:**
- Large existing codebases (start gradual)
- Projects with dynamic imports
- Code with intentional side effects
- Projects without good test coverage

### Common False Positives

1. **Dynamic imports**: `import('module')` may not be detected
2. **Reflection/metaprogramming**: Code accessed via strings
3. **Side effects**: Import for side effects may be flagged
4. **Test utilities**: May be flagged if not properly configured

### Handling False Positives

```javascript
// Use underscore prefix for intentionally unused
function handler(_unusedParam: string, data: any) {}

// Use ESLint disable comments for specific cases
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamicallyUsedVar = 'used via reflection';

// Configure ignore patterns
export default baseConfig({
	aggressiveCleanup: true,
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', {
			argsIgnorePattern: '^_|^props$',
			varsIgnorePattern: '^_|^React$'
		}]
	}
});
```

## 📈 Migration Strategy

### Phase 1: Assessment (1-2 weeks)
1. Enable aggressive mode with warnings only
2. Run cleanup checks to assess scope
3. Identify patterns of false positives

### Phase 2: Gradual Adoption (2-4 weeks)
1. Fix low-hanging fruit (unused imports, obvious dead code)
2. Update configurations to handle false positives
3. Start enforcing errors for critical rules

### Phase 3: Full Enforcement (ongoing)
1. Enable all aggressive rules as errors
2. Integrate into CI/CD pipeline
3. Regular cleanup reviews and maintenance

## 🔗 Related Documentation

- [ESLint Configuration Guide](../README.md)
- [Complexity Rules Documentation](./COMPLEXITY_RULES.md)
- [Auto Installation Guide](./AUTO_INSTALL.md)

---

**Need Help?** Open an issue on the [GitHub repository](https://github.com/dmitryrechkin/eslint-standard) with your specific use case.