import { ESLint } from 'eslint';

async function testMinimal() {
    console.log('Testing minimal config...\n');
    
    const code = `
const items = [1, 2, 3];
items.forEach(item => {
    console.log(item);
});
`;

    // Test with just the unicorn plugin
    const eslintUnicorn = new ESLint({
        fix: true,
        overrideConfig: {
            plugins: {
                unicorn: (await import('eslint-plugin-unicorn')).default
            },
            rules: {
                'unicorn/no-array-for-each': 'error'
            }
        }
    });

    console.log('=== Testing with unicorn/no-array-for-each ===');
    const unicornResults = await eslintUnicorn.lintText(code);
    console.log('Original:', code.trim());
    console.log('Fixed:', unicornResults[0].output?.trim() || 'No changes');
    console.log('Messages:', unicornResults[0].messages);

    // Test with functional plugin
    const eslintFunctional = new ESLint({
        fix: false,
        overrideConfig: {
            plugins: {
                functional: (await import('eslint-plugin-functional')).default
            },
            rules: {
                'functional/no-loop-statements': 'warn'
            }
        }
    });

    console.log('\n=== Testing with functional/no-loop-statements ===');
    const functionalResults = await eslintFunctional.lintText(unicornResults[0].output || code);
    console.log('Messages:', functionalResults[0].messages);
}

testMinimal().catch(console.error);