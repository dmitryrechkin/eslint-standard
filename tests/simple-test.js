#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 ESLint Standard Simple Formatting Test\n');

// Copy origin file to temp test file in provider-core (where dependencies work)
const originPath = path.join(__dirname, 'test-formatting.ts.origin');
const tempTestPath = path.join(process.cwd(), 'temp-test-formatting.ts');

if (!fs.existsSync(originPath)) {
  console.error('❌ Origin file not found:', originPath);
  process.exit(1);
}

console.log('📄 Copying origin file to provider-core temp location...');
fs.copyFileSync(originPath, tempTestPath);

// Read the test file before formatting
const beforeContent = fs.readFileSync(tempTestPath, 'utf8');
console.log('📋 Original content analysis:');

// Check import order
const importLines = beforeContent.split('\n').filter(line => line.trim().startsWith('import'));
console.log('- Import lines before:', importLines.length);
importLines.slice(0, 3).forEach((line, i) => console.log(`  ${i+1}. ${line.trim()}`));

// Check JSDoc alignment
const jsdocLines = beforeContent.split('\n').filter(line => line.match(/^\s*\*/));
const hasSpaceIndent = jsdocLines.some(line => line.match(/^   \*/)); // 3+ spaces
console.log('- JSDoc issues before:', hasSpaceIndent ? 'Has space indentation' : 'Looks OK');
if (hasSpaceIndent) {
  jsdocLines.slice(0, 2).forEach(line => console.log(`  "${line}"`));
}

try {
  console.log('\n🔧 Running ESLint --fix with provider-core config...');
  
  // Run ESLint from provider-core directory with its working config
  execSync(`npx eslint temp-test-formatting.ts --fix`, { 
    stdio: 'pipe',
    cwd: process.cwd()
  });
  
  // Read the test file after formatting
  const afterContent = fs.readFileSync(tempTestPath, 'utf8');
  console.log('✅ Formatting completed!');
  
  // Analyze results
  const afterLines = afterContent.split('\n');
  
  // Check imports are sorted
  const afterImportLines = afterLines.filter(line => line.trim().startsWith('import'));
  console.log('\n📦 Import sorting results:');
  console.log('- Import lines after:', afterImportLines.length);
  afterImportLines.slice(0, 3).forEach((line, i) => console.log(`  ${i+1}. ${line.trim()}`));
  
  // Check JSDoc alignment
  const afterJsdocLines = afterLines.filter(line => line.match(/^\s*\*/));
  const stillHasSpaces = afterJsdocLines.some(line => line.match(/^   \*/)); // 3+ spaces
  console.log('\n📝 JSDoc alignment results:');
  console.log('- Space indentation issues:', stillHasSpaces ? 'STILL PRESENT' : 'FIXED ✅');
  if (afterJsdocLines.length > 0) {
    afterJsdocLines.slice(0, 2).forEach(line => console.log(`  "${line}"`));
  }
  
  // Check member ordering (look for class structure)
  const classStartIndex = afterLines.findIndex(line => line.includes('export class TestClass'));
  if (classStartIndex !== -1) {
    console.log('\n🏗️  Class member ordering results:');
    const classLines = afterLines.slice(classStartIndex, classStartIndex + 15);
    const relevantLines = classLines.filter((line, i) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('{');
    });
    relevantLines.slice(0, 8).forEach((line, i) => {
      console.log(`  ${i + 1}: ${line.trim()}`);
    });
  }
  
  // Copy result back to original location for review
  const resultPath = path.join(__dirname, 'test-formatting.ts');
  fs.copyFileSync(tempTestPath, resultPath);
  
  // Clean up
  fs.unlinkSync(tempTestPath);
  
  // Final validation
  if (stillHasSpaces) {
    console.error('\n❌ FAILED: JSDoc comments still have incorrect indentation');
    process.exit(1);
  } else {
    console.log('\n🎉 SUCCESS: ESLint formatting worked correctly!');
    console.log('📁 Formatted file available at: tests/test-formatting.ts');
    console.log('🔍 Compare with tests/test-formatting.ts.origin to see all changes');
  }
  
} catch (error) {
  console.error('\n❌ Error running test:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout.toString());
  if (error.stderr) console.log('STDERR:', error.stderr.toString());
  
  // Clean up on error
  if (fs.existsSync(tempTestPath)) {
    fs.unlinkSync(tempTestPath);
  }
  process.exit(1);
}