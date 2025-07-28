# Built-in Complexity Rules

`@dmitryrechkin/eslint-standard` includes industry-standard complexity rules by default to ensure code maintainability and readability. These rules help detect code quality issues like deep nesting, large functions, and violations of SOLID principles.

## Available Rules

### 1. Cyclomatic Complexity
```javascript
'complexity': ['error', 10]
```
- Limits the number of linearly independent paths through a function
- Default: 10 (strict mode: 5)
- Helps identify functions that are doing too much

### 2. Function Length
```javascript
'max-lines-per-function': ['error', {
    max: 100,
    skipBlankLines: true,
    skipComments: true
}]
```
- Limits function length to 100 lines (pragmatic for complex business logic)
- Encourages reasonably sized, focused functions
- Balances Single Responsibility with real-world needs

### 3. Maximum Statements
```javascript
'max-statements': ['error', 20]
```
- Limits the number of statements in a function
- Default: 20 (strict mode: 10)
- Forces decomposition of complex logic

### 4. Nesting Depth
```javascript
'max-depth': ['error', { max: 3 }]
```
- Limits block nesting to 3 levels (strict mode: 2)
- Prevents deeply nested if/else chains
- Encourages early returns and guard clauses

### 5. Callback Nesting
```javascript
'max-nested-callbacks': ['error', 3]
```
- Limits callback nesting depth
- Encourages use of async/await or promises
- Prevents "callback hell"

### 6. Parameter Count
```javascript
'max-params': ['error', 4]
```
- Limits function parameters to 4 (strict mode: 3)
- Encourages parameter objects for complex functions
- Improves function signatures

### 7. File Size
```javascript
'max-lines': ['warn', {
    max: 300,
    skipBlankLines: true,
    skipComments: true
}]
```
- Warns when files exceed 300 lines
- Encourages modular code organization
- Helps maintain Single Responsibility for modules

## Customizing Rules

The complexity rules are included by default. You can customize them by overriding specific rules:

```javascript
import eslintStandard from '@dmitryrechkin/eslint-standard';

export default eslintStandard({
    tsconfigPath: './tsconfig.json',
    rules: {
        // Make complexity stricter
        'complexity': ['error', 8],
        'max-lines-per-function': ['error', { max: 40 }],
        'max-depth': ['error', { max: 2 }],
        
        // Or relax for legacy code
        'complexity': ['warn', 15],
        'max-lines-per-function': ['warn', { max: 100 }],
        
        // Or disable specific rules
        'max-lines': 'off'
    }
});
```

## Examples of Violations

### 1. High Cyclomatic Complexity
```typescript
// ❌ BAD: Complexity > 10
function processOrder(order: Order): Result {
    if (order.status === 'pending') {
        if (order.payment) {
            if (order.payment.method === 'credit') {
                if (order.payment.verified) {
                    // ... more conditions
                }
            } else if (order.payment.method === 'debit') {
                // ... more branches
            }
        }
    } else if (order.status === 'processing') {
        // ... more branches
    }
    // Total complexity: 15+
}

// ✅ GOOD: Break into smaller functions
function processOrder(order: Order): Result {
    if (!isOrderReady(order)) {
        return { error: 'Order not ready' };
    }
    
    const payment = processPayment(order.payment);
    if (!payment.success) {
        return { error: payment.error };
    }
    
    return completeOrder(order, payment);
}
```

### 2. Deep Nesting
```typescript
// ❌ BAD: Nesting depth > 3
function validateData(data: any): boolean {
    if (data) {
        if (data.user) {
            if (data.user.profile) {
                if (data.user.profile.email) {
                    return validateEmail(data.user.profile.email);
                }
            }
        }
    }
    return false;
}

// ✅ GOOD: Use early returns
function validateData(data: any): boolean {
    if (!data?.user?.profile?.email) {
        return false;
    }
    return validateEmail(data.user.profile.email);
}
```

### 3. Long Functions
```typescript
// ❌ BAD: Function > 50 lines
function generateReport(data: Data): Report {
    // 100+ lines of code doing multiple things:
    // - Data validation
    // - Data transformation
    // - Calculations
    // - Formatting
    // - File generation
}

// ✅ GOOD: Split into focused functions
function generateReport(data: Data): Report {
    const validatedData = validateReportData(data);
    const transformedData = transformReportData(validatedData);
    const calculations = calculateReportMetrics(transformedData);
    const formatted = formatReportData(calculations);
    return createReportFile(formatted);
}
```

## Benefits

1. **Improved Readability**: Smaller functions are easier to understand
2. **Better Testability**: Simple functions are easier to test
3. **Reduced Bugs**: Less complex code has fewer places for bugs to hide
4. **Easier Maintenance**: Changes are localized to smaller units
5. **Team Collaboration**: Consistent complexity limits across the codebase

## Migration Strategy

1. **Start with Warnings**: Use `warn` instead of `error` initially
2. **Fix Incrementally**: Address the worst violations first
3. **Set Realistic Goals**: Gradually tighten limits over time
4. **Document Exceptions**: Use `eslint-disable` comments sparingly with explanations

## Related Tools

- **SonarQube**: For comprehensive code quality metrics
- **CodeClimate**: For tracking technical debt
- **Lizard**: For cyclomatic complexity analysis
- **JSComplexity**: Visual complexity reports