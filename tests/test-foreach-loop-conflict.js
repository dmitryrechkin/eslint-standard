const { ESLint } = require('eslint');
const path = require('path');

async function testForEachLoopConflict() {
    console.log('Testing forEach to for loop conversion conflict...\n');
    
    const eslint = new ESLint({
        overrideConfigFile: path.join(__dirname, '..', 'eslint.config.mjs'),
        fix: true
    });

    const code = `
const items = [1, 2, 3, 4, 5];
const results = [];

// Test 1: forEach with arrow function
items.forEach((item) => {
    results.push(item * 2);
});

// Test 2: forEach with index
items.forEach((item, index) => {
    console.log(\`Item at \${index}: \${item}\`);
});

// Test 3: Object.entries with forEach
const obj = { a: 1, b: 2, c: 3 };
Object.entries(obj).forEach(([key, value]) => {
    console.log(\`\${key}: \${value}\`);
});
`;

    try {
        // First pass - check what ESLint does
        console.log('Original code:');
        console.log(code);
        console.log('\n--- Running ESLint with --fix ---\n');

        const results = await eslint.lintText(code, { filePath: 'test.js' });
        const result = results[0];

        console.log('Messages:', result.messages.length);
        result.messages.forEach(msg => {
            console.log(`  ${msg.line}:${msg.column} ${msg.severity === 2 ? 'error' : 'warning'} ${msg.message} (${msg.ruleId})`);
        });

        if (result.output && result.output !== code) {
            console.log('\nFixed code:');
            console.log(result.output);
            
            // Second pass - lint the fixed code
            console.log('\n--- Running ESLint on fixed code ---\n');
            const secondResults = await eslint.lintText(result.output, { filePath: 'test.js' });
            const secondResult = secondResults[0];
            
            console.log('Messages:', secondResult.messages.length);
            secondResult.messages.forEach(msg => {
                console.log(`  ${msg.line}:${msg.column} ${msg.severity === 2 ? 'error' : 'warning'} ${msg.message} (${msg.ruleId})`);
            });
        } else {
            console.log('\nNo changes made by --fix');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testForEachLoopConflict().catch(console.error);