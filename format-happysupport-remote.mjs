import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🎯 Direct Formatting: HappySupport CommandValidationHelper.ts (Remote)');
console.log('=' .repeat(70));

const targetDir = '/Users/dmitry/Projects/OneTeamSoftware/TypeScript/HappySupport/apps/kb-generator';
const targetFile = 'src/helpers/CommandValidationHelper.ts';
const fullTargetPath = path.join(targetDir, targetFile);

// Copy our rule to the target directory
const ruleSource = './src/plugins/switch-case-brace.mjs';
const ruleDest = path.join(targetDir, 'switch-case-brace-local.mjs');

console.log('📋 Copying switch case rule to HappySupport directory...');
fs.copyFileSync(ruleSource, ruleDest);

// Create ESLint config in the target directory
const configContent = `
import switchCaseBracePlugin from './switch-case-brace-local.mjs';

export default [
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: await import('@typescript-eslint/parser'),
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module'
			}
		},
		plugins: {
			'switch-case-brace': switchCaseBracePlugin
		},
		rules: {
			'switch-case-brace/switch-case-brace-style': 'error'
		}
	}
];
`;

const configDest = path.join(targetDir, 'eslint-switch-test.config.mjs');
fs.writeFileSync(configDest, configContent);

try {
	console.log('📄 Target file:', fullTargetPath);
	
	// Show before state
	const originalCode = fs.readFileSync(fullTargetPath, 'utf8');
	const problemLines = originalCode.split('\n').filter(line => 
		line.includes('{return KnowledgeBaseResponseHelper') || 
		line.includes('{validStatuses.push(')
	);
	
	console.log(`\n📊 Issues found: ${problemLines.length} single-line case blocks`);
	console.log('📝 Sample issues:');
	problemLines.slice(0, 2).forEach(line => {
		console.log(`   ${line.trim()}`);
	});
	
	// Run ESLint from the target directory
	console.log('\n🚀 Running ESLint from HappySupport directory...');
	const eslintCommand = `npx eslint "${targetFile}" --config eslint-switch-test.config.mjs --fix`;
	
	console.log(`   Command: ${eslintCommand}`);
	console.log(`   Working directory: ${targetDir}`);
	
	try {
		const result = execSync(eslintCommand, { 
			stdio: 'pipe',
			encoding: 'utf8',
			cwd: targetDir
		});
		console.log('✅ ESLint completed successfully');
		if (result) {
			console.log('📤 Output:', result);
		}
	} catch (error) {
		console.log('⚠️  ESLint completed with output:');
		if (error.stdout) {
			console.log('   Stdout:', error.stdout.toString().trim());
		}
		if (error.stderr && error.stderr.toString().trim()) {
			console.log('   Stderr:', error.stderr.toString().trim());
		}
	}
	
	// Check results
	const fixedCode = fs.readFileSync(fullTargetPath, 'utf8');
	const remainingIssues = fixedCode.split('\n').filter(line => 
		line.includes('{return KnowledgeBaseResponseHelper') || 
		line.includes('{validStatuses.push(')
	);
	
	console.log('\n📊 Results:');
	console.log(`   Issues before: ${problemLines.length}`);
	console.log(`   Issues after: ${remainingIssues.length}`);
	console.log(`   Fixed: ${problemLines.length - remainingIssues.length} ✅`);
	
	if (remainingIssues.length === 0) {
		console.log('\n🎉 SUCCESS: All switch case formatting issues resolved!');
		
		// Show sample of fixed formatting
		const switchStart = fixedCode.indexOf('switch (priorityValue)');
		if (switchStart !== -1) {
			console.log('\n📄 Sample fixed formatting:');
			const lines = fixedCode.split('\n');
			const startLine = fixedCode.substring(0, switchStart).split('\n').length;
			lines.slice(startLine - 1, startLine + 8).forEach((line, i) => {
				console.log(`   ${String(startLine + i).padStart(3)}: ${line}`);
			});
		}
	} else {
		console.log('\n⚠️  Some issues remain:');
		remainingIssues.slice(0, 3).forEach(line => {
			console.log(`   ${line.trim()}`);
		});
	}
	
} finally {
	// Clean up temporary files
	console.log('\n🧹 Cleaning up temporary files...');
	if (fs.existsSync(ruleDest)) {
		fs.unlinkSync(ruleDest);
		console.log('   Removed:', ruleDest);
	}
	if (fs.existsSync(configDest)) {
		fs.unlinkSync(configDest);
		console.log('   Removed:', configDest);
	}
}

console.log('\n' + '='.repeat(70));