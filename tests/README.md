# ESLint Standard Tests

## Test Files

### `test-formatting.ts.origin`
This is the **source of truth** test file containing various formatting issues that should be automatically fixed by our ESLint configuration. It includes:

#### 🔧 **Import Sorting Issues**
- Imports in wrong order (type imports mixed with regular imports)
- Should be automatically sorted by `simple-import-sort`

#### 📝 **JSDoc Comment Issues**
- Misaligned JSDoc comments with space indentation instead of proper alignment
- Should be fixed by our custom `jsdoc-indent` plugin with `tabWidth: 4`

#### 🏗️ **Member Ordering Issues**
- Class members in wrong order (private before public, static after instance, etc.)
- Should be reordered by `@typescript-eslint/member-ordering` rule

#### 📏 **General Formatting Issues**
- Mixed indentation
- Trailing spaces
- Missing semicolons
- Wrong brace styles

## Expected Order (after fixing)
1. **Fields**: public static → protected static → private static → public instance → protected instance → private instance
2. **Constructors**: public → protected → private
3. **Getters/Setters**: public → protected → private (grouped by type)
4. **Methods**: public static → protected static → private static → public instance → protected instance → private instance

## Running Tests

```bash
# Run the formatting test
npm run test:formatting

# Or run directly
node tests/test-runner.js
```

## What the Test Does

1. **Copies** `test-formatting.ts.origin` → `test-formatting.ts`
2. **Runs** `eslint --fix` on the test file
3. **Validates** that all formatting rules were applied:
   - Import sorting
   - JSDoc alignment
   - Member ordering
   - General formatting
4. **Reports** success/failure with detailed output

## Manual Review

After running the test, you can manually compare:
- **Before**: `tests/test-formatting.ts.origin` 
- **After**: `tests/test-formatting.ts`

This helps verify that our ESLint configuration works as expected!