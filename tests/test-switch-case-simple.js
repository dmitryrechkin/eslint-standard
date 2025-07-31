#!/usr/bin/env node

/**
 * Simple test for Switch Case Brace formatting rule
 */

const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

const testContent = `function testSwitch(value) {
    switch (value) {
        case 'A': {
            return 'first';
        }
        case 'B': {
            return 'second';
        }
        default: {
            return 'unknown';
        }
    }
}`;

async function testSwitchCaseBraceFormatting() {
    console.log('🧪 Switch Case Brace Formatting Test\n');

    const testFilePath = path.join(__dirname, 'test-switch-temp.js');

    try {
        console.log('📄 Creating test file...');
        fs.writeFileSync(testFilePath, testContent);

        console.log('📋 Original formatting:');
        console.log(testContent.split('\n').slice(2, 6).join('\n'));

        // Create minimal ESLint config for testing
        const switchCaseBracePlugin = (await import('../src/plugins/switch-case-brace.mjs')).default;
        
        const eslint = new ESLint({
            overrideConfig: [{
                plugins: {
                    'switch-case-brace': switchCaseBracePlugin
                },
                rules: {
                    'switch-case-brace/switch-case-brace-style': 'error'
                }
            }],
            fix: true
        });

        console.log('\n🔧 Running ESLint with --fix...');
        const results = await eslint.lintFiles([testFilePath]);
        await ESLint.outputFixes(results);

        const fixedContent = fs.readFileSync(testFilePath, 'utf8');
        
        console.log('\n✅ Fixed formatting:');
        console.log(fixedContent.split('\n').slice(2, 8).join('\n'));

        // Check if formatting is correct
        const hasCorrectFormatting = fixedContent.includes("case 'A':\n\t{") ||
                                    fixedContent.includes("case 'A':\n        {");

        console.log('\n📊 Test Results:');
        console.log(`✅ Switch case brace formatting: ${hasCorrectFormatting ? 'PASS' : 'FAIL'}`);
        
        if (hasCorrectFormatting) {
            console.log('\n🎉 SUCCESS: Switch case brace formatting rule is working!');
            return true;
        } else {
            console.log('\n❌ FAILURE: Switch case brace formatting rule is not working.');
            console.log('Debug - Fixed content:');
            console.log(fixedContent);
            return false;
        }

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        return false;
    } finally {
        try {
            if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
        } catch (cleanupError) {
            console.warn('⚠️  Cleanup warning:', cleanupError.message);
        }
    }
}

if (require.main === module) {
    testSwitchCaseBraceFormatting()
        .then(success => process.exit(success ? 0 : 1))
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}