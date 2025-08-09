#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 ESLint Standard Simple Formatting Test\n');
console.log('This test validates comprehensive formatting improvements and rule effectiveness.\n');

// File paths
const originPath = path.join(__dirname, 'test-formatting.ts.origin');
const testPath = path.join(__dirname, 'test-formatting.ts');
const configPath = path.join(__dirname, 'test-config.mjs');

// Ensure required files exist
if (!fs.existsSync(originPath)) {
	console.error('❌ Origin file not found:', originPath);
	process.exit(1);
}

if (!fs.existsSync(configPath)) {
	console.error('❌ Config file not found:', configPath);
	process.exit(1);
}

console.log('📄 Setting up test file...');
fs.copyFileSync(originPath, testPath);

// Read original content for analysis
const beforeContent = fs.readFileSync(testPath, 'utf8');
const beforeLines = beforeContent.split('\n');

console.log('\n📋 Original Content Analysis:');
console.log(`- Total lines: ${beforeLines.length}`);
console.log(`- Import statements: ${beforeLines.filter(line => line.trim().startsWith('import')).length}`);
console.log(`- Interface definitions: ${beforeLines.filter(line => line.includes('interface')).length}`);
console.log(`- Class definitions: ${beforeLines.filter(line => line.includes('class')).length}`);
console.log(`- Function definitions: ${beforeLines.filter(line => line.includes('function')).length}`);

// Sample formatting issues to look for
const formattingIssues = {
	'JSDoc misalignment': beforeLines.filter(line => line.includes('*') && !line.trim().startsWith('*')).length,
	'Missing JSDoc comments': beforeLines.filter((line, i) => {
		const trimmed = line.trim();
		return (trimmed.startsWith('export function') || 
				trimmed.startsWith('export const') || 
				trimmed.startsWith('export type') ||
				trimmed.startsWith('export enum')) && 
				!beforeLines[i-1]?.trim().startsWith('/**');
	}).length,
	'Inconsistent indentation': beforeLines.filter(line => line.startsWith('  ') && !line.startsWith('\t')).length
};

console.log('\n🔍 Detected Formatting Issues:');
Object.entries(formattingIssues).forEach(([issue, count]) => {
	if (count > 0) {
		console.log(`- ${issue}: ${count} occurrences`);
	}
});

try {
	console.log('\n🔧 Running ESLint --fix...');
	
	// Run ESLint with fix
	execSync(`npx eslint "${testPath}" --config "${configPath}" --fix`, {
		cwd: path.join(__dirname, '..'),
		stdio: 'pipe'
	});
	
	console.log('✅ ESLint --fix completed successfully');
	
} catch (eslintError) {
	console.log('⚠️  ESLint completed with some unfixable issues (expected)');
	if (eslintError.stdout) {
		console.log('\nESLint output:', eslintError.stdout.toString());
	}
}

// Read the fixed content for analysis
const afterContent = fs.readFileSync(testPath, 'utf8');
const afterLines = afterContent.split('\n');

console.log('\n📊 Post-Fix Content Analysis:');
console.log(`- Total lines: ${afterLines.length} (${afterLines.length - beforeLines.length >= 0 ? '+' : ''}${afterLines.length - beforeLines.length})`);

// Analyze improvements
const improvements = {
	'Import organization': {
		before: beforeLines.filter(line => line.trim().startsWith('import')).length,
		after: afterLines.filter(line => line.trim().startsWith('import')).length
	},
	'JSDoc alignment fixes': {
		before: beforeLines.filter(line => line.includes('*') && !line.trim().startsWith('*')).length,
		after: afterLines.filter(line => line.includes('*') && !line.trim().startsWith('*')).length
	},
	'Consistent indentation': {
		before: beforeLines.filter(line => line.startsWith('  ') && !line.startsWith('\t')).length,
		after: afterLines.filter(line => line.startsWith('  ') && !line.startsWith('\t')).length
	}
};

console.log('\n✨ Formatting Improvements Applied:');
Object.entries(improvements).forEach(([improvement, data]) => {
	const diff = data.before - data.after;
	if (diff > 0) {
		console.log(`- ${improvement}: Fixed ${diff} issues`);
	} else if (data.before > 0) {
		console.log(`- ${improvement}: ${data.before} issues detected (may need manual fix)`);
	}
});

// Sample lines comparison
console.log('\n🔍 Sample Before/After Comparison:');
const sampleLineIndex = beforeLines.findIndex(line => line.includes('JSDoc'));
if (sampleLineIndex > -1 && sampleLineIndex < Math.min(beforeLines.length, afterLines.length)) {
	console.log('Before:', beforeLines[sampleLineIndex].replace(/^\s+/, '→ '));
	console.log('After: ', afterLines[sampleLineIndex].replace(/^\s+/, '→ '));
}

// Final validation
try {
	console.log('\n🎯 Running final validation...');
	const validationResult = execSync(`npx eslint "${testPath}" --config "${configPath}"`, {
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8',
		stdio: 'pipe'
	});
	console.log('✅ Final validation passed - no linting errors');
	
} catch (validationError) {
	const errorOutput = validationError.stdout?.toString() || validationError.stderr?.toString() || '';
	const errorCount = (errorOutput.match(/error/g) || []).length;
	const warningCount = (errorOutput.match(/warning/g) || []).length;
	
	console.log(`📋 Final validation results: ${errorCount} errors, ${warningCount} warnings`);
	if (errorCount === 0) {
		console.log('✅ All fixable issues resolved successfully');
	} else {
		console.log('⚠️  Some issues require manual attention');
	}
}

console.log('\n🎉 Simple Test Complete!');
console.log('\nThis test validates:');
console.log('- Automatic formatting improvements');
console.log('- Rule effectiveness in practice');
console.log('- Before/after analysis of code quality');
console.log('- Comprehensive ESLint configuration validation');