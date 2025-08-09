#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 ESLint Standard Debug Test\n');
console.log('This tool helps debug ESLint configuration issues and rule behavior.\n');

const testFile = path.join(__dirname, 'fixtures/unicorn-violations.ts');
const configFile = path.join(__dirname, 'test-config.mjs');

if (!fs.existsSync(testFile)) {
	console.error('❌ Test file not found:', testFile);
	process.exit(1);
}

if (!fs.existsSync(configFile)) {
	console.error('❌ Config file not found:', configFile);
	process.exit(1);
}

console.log('📋 Debug Information:');
console.log(`- Test file: ${testFile}`);
console.log(`- Config file: ${configFile}`);
console.log(`- Working directory: ${process.cwd()}`);
console.log(`- Node version: ${process.version}`);

try {
	console.log('\n🔧 Running ESLint in debug mode...');
	
	const result = execSync(`npx eslint "${testFile}" --config "${configFile}" --no-fix`, {
		cwd: path.join(__dirname, '..'),
		encoding: 'utf8',
		stdio: 'pipe'
	});
	
	console.log('\n✅ ESLint execution successful!');
	console.log('\n📊 ESLint Output:');
	console.log(result);
	
} catch (error) {
	if (error.stdout) {
		console.log('\n📊 ESLint Output (with errors):');
		console.log(error.stdout);
	}
	
	if (error.stderr) {
		console.log('\n⚠️ ESLint Errors:');
		console.log(error.stderr);
	}
	
	console.log(`\n💡 Exit code: ${error.status}`);
}

console.log('\n🔍 Configuration Analysis:');
try {
	const configPath = path.join(__dirname, '..', 'eslint.config.mjs');
	console.log(`- Main config exists: ${fs.existsSync(configPath)}`);
	console.log(`- Test config exists: ${fs.existsSync(configFile)}`);
	
	// Check if test fixtures exist
	const fixturesDir = path.join(__dirname, 'fixtures');
	if (fs.existsSync(fixturesDir)) {
		const fixtures = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.ts'));
		console.log(`- Available fixtures: ${fixtures.join(', ')}`);
	} else {
		console.log('- Fixtures directory not found');
	}
	
} catch (configError) {
	console.error('❌ Configuration analysis failed:', configError.message);
}

console.log('\n🎯 Debug Test Complete!');
console.log('\nUsage tips:');
console.log('- Check that all file paths are accessible');
console.log('- Verify ESLint configuration is valid');
console.log('- Review rule-specific violations in output');
console.log('- Use this when rules are not working as expected');