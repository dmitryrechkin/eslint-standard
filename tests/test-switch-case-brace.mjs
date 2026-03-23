#!/usr/bin/env node

/**
 * Test script for Switch Case Brace formatting rule
 * Tests the custom switch-case-brace/switch-case-brace-style rule
 */

const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

// Test file content with incorrectly formatted switch cases
const testContent = `/**
 * Test switch case brace formatting
 * @param {string} priorityValue - The priority value to test
 * @param {string} priority - The priority string for error messages
 * @returns {object} Success or error response
 */
function testSwitchCaseBraces(priorityValue, priority) {
    switch (priorityValue) {
        case 'LOW': {
            const result = { success: true, data: 'low' };
            console.log('Processing LOW priority');
            return result;
        }
        case 'MEDIUM': {
            const result = { success: true, data: 'medium' };
            console.log('Processing MEDIUM priority');
            return result;
        }
        case 'HIGH': {
            return { success: true, data: 'high' };
        }
        default: {
            return {
                success: false,
                code: 'validation_error',
                message: \`Invalid priority value: \${priority}. Valid values are: LOW, MEDIUM, HIGH\`
            };
        }
    }
}`;

// Expected output after formatting
const expectedContent = `/**
 * Test switch case brace formatting
 * @param {string} priorityValue - The priority value to test
 * @param {string} priority - The priority string for error messages
 * @returns {object} Success or error response
 */
function testSwitchCaseBraces(priorityValue, priority) {
    switch (priorityValue) {
        case 'LOW':
\t{
            const result = { success: true, data: 'low' };
            console.log('Processing LOW priority');
            return result;
        }
        case 'MEDIUM':
\t{
            const result = { success: true, data: 'medium' };
            console.log('Processing MEDIUM priority');
            return result;
        }
        case 'HIGH':
\t{
            return { success: true, data: 'high' };
        }
        default:
\t{
            return {
                success: false,
                code: 'validation_error',
                message: \`Invalid priority value: \${priority}. Valid values are: LOW, MEDIUM, HIGH\`
            };
        }
    }
}`;

async function testSwitchCaseBraceFormatting() {
    console.log('🧪 Switch Case Brace Formatting Test\n');

    const testFilePath = path.join(__dirname, 'test-switch-case-temp.js');
    const originFilePath = testFilePath + '.origin';

    try {
        // Create test file
        console.log('📄 Creating test file...');
        fs.writeFileSync(testFilePath, testContent);
        fs.writeFileSync(originFilePath, testContent);

        // Show original formatting
        console.log('📋 Original switch case formatting:');
        const originalLines = testContent.split('\\n').slice(8, 16);
        originalLines.forEach((line, index) => {
            console.log(`  ${9 + index}: ${line}`);
        });
        console.log('');

        // Create ESLint instance with our config
        const eslint = new ESLint({
            overrideConfigFile: path.join(__dirname, '..', 'eslint.config.mjs'),
            overrideConfig: [
                {
                    languageOptions: {
                        parserOptions: {
                            project: null // Disable typescript parsing for this test
                        }
                    }
                }
            ],
            fix: true
        });

        // Run ESLint
        console.log('🔧 Running ESLint with --fix...');
        const results = await eslint.lintFiles([testFilePath]);

        // Apply fixes
        await ESLint.outputFixes(results);

        // Read the fixed content
        const fixedContent = fs.readFileSync(testFilePath, 'utf8');

        // Show fixed formatting
        console.log('✅ Fixed switch case formatting:');
        const fixedLines = fixedContent.split('\\n').slice(8, 18);
        fixedLines.forEach((line, index) => {
            console.log(`  ${9 + index}: ${line}`);
        });
        console.log('');

        // Verify the formatting
        const hasCorrectFormatting = fixedContent.includes("case 'LOW':\\n\\t{") &&
                                   fixedContent.includes("case 'MEDIUM':\\n\\t{") &&
                                   fixedContent.includes("case 'HIGH':\\n\\t{") &&
                                   fixedContent.includes("default:\\n\\t{");

        // Show results
        console.log('📊 Test Results:');
        console.log(`✅ Switch case braces on new lines: ${hasCorrectFormatting ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Proper indentation: ${fixedContent.includes("\\t{") ? 'PASS' : 'FAIL'}`);
        console.log(`✅ All cases formatted: ${(fixedContent.match(/case .*:\\n\\t{/g) || []).length >= 3 ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Default case formatted: ${fixedContent.includes("default:\\n\\t{") ? 'PASS' : 'FAIL'}`);

        if (hasCorrectFormatting) {
            console.log('\\n🎉 SUCCESS: Switch case brace formatting rule is working correctly!');
            console.log('📁 Case blocks now have opening braces on new lines with proper indentation.');
            return true;
        } else {
            console.log('\\n❌ FAILURE: Switch case brace formatting rule is not working correctly.');
            console.log('💡 Expected case blocks to have opening braces on new lines.');
            return false;
        }

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        return false;
    } finally {
        // Cleanup
        try {
            if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
            if (fs.existsSync(originFilePath)) fs.unlinkSync(originFilePath);
        } catch (cleanupError) {
            console.warn('⚠️  Cleanup warning:', cleanupError.message);
        }
    }
}

// Run the test
if (require.main === module) {
    testSwitchCaseBraceFormatting()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { testSwitchCaseBraceFormatting };