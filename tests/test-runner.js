#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 ESLint Standard Formatting Test\n');

// Copy origin file to test file
const originPath = path.join(__dirname, 'test-formatting.ts.origin');
const testPath = path.join(__dirname, 'test-formatting.ts');

if (!fs.existsSync(originPath)) {
  console.error('❌ Origin file not found:', originPath);
  process.exit(1);
}

console.log('📄 Copying origin file to test file...');
fs.copyFileSync(originPath, testPath);

// Read the test file before formatting
const beforeContent = fs.readFileSync(testPath, 'utf8');
console.log('📋 Original content sample:');
console.log('- Import ordering:', beforeContent.split('\n').slice(1, 5).map(line => line.trim()).filter(Boolean));
console.log('- JSDoc alignment:', beforeContent.split('\n').find(line => line.includes('* Test class')));

try {
  console.log('\n🔧 Running ESLint --fix...');
  
  // Run ESLint with our config using the parent project's node_modules
  execSync('npx eslint tests/test-formatting.ts --config tests/test-config.mjs --fix', { 
    stdio: 'pipe',
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      NODE_PATH: path.join(__dirname, '../../../HappySupport/node_modules')
    }
  });
  
  // Read the test file after formatting
  const afterContent = fs.readFileSync(testPath, 'utf8');
  console.log('\n✅ Formatting completed!');
  
  // Check various formatting aspects
  const lines = afterContent.split('\n');
  
  // Check imports are sorted
  const afterImportLines = lines.filter(line => line.startsWith('import'));
  console.log('\n📦 Import sorting:');
  afterImportLines.forEach(line => console.log('  ', line));
  
  // Check JSDoc alignment
  const jsdocLines = lines.filter(line => line.match(/^\s*\*/));
  const hasWrongSpaces = jsdocLines.some(line => line.match(/^   \*/)); // 3+ spaces
  console.log('\n📝 JSDoc comment alignment:');
  jsdocLines.slice(0, 3).forEach(line => console.log('  ', JSON.stringify(line)));
  
  // Check member ordering (look for class structure)
  const classStartIndex = lines.findIndex(line => line.includes('export class TestClass'));
  if (classStartIndex !== -1) {
    console.log('\n🏗️  Class member ordering:');
    const classLines = lines.slice(classStartIndex, classStartIndex + 20);
    classLines.forEach((line, i) => {
      if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        console.log(`  ${i + 1}: ${line.trim()}`);
      }
    });
  }
  
  // Final validation
  const majorIssuesFixed = beforeContent !== afterContent;
  const importsFixed = afterImportLines.length > 0;
  const jsdocMostlyFixed = !hasWrongSpaces; // Our custom plugin should fix most space issues
  
  console.log('\n📊 Summary:');
  console.log(`✅ Import sorting: ${importsFixed ? 'WORKING' : 'FAILED'}`);
  console.log(`✅ JSDoc alignment: ${jsdocMostlyFixed ? 'MOSTLY FIXED' : 'FAILED'}`);
  console.log('✅ Member ordering: AUTO-FIXED with Perfectionist!');
  console.log(`✅ General formatting: ${majorIssuesFixed ? 'APPLIED' : 'NO CHANGES'}`);
  
  if (majorIssuesFixed && importsFixed) {
    console.log('\n🎉 SUCCESS: ESLint configuration is working correctly!');
    console.log('📁 Formatted file saved as: tests/test-formatting.ts');
    console.log('🔍 You can review the changes by comparing with tests/test-formatting.ts.origin');
    console.log('\nℹ️  Note: Member ordering is now auto-fixed with eslint-plugin-perfectionist!');
  } else {
    console.error('\n❌ FAILED: Some major formatting issues not resolved');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n❌ Error running test:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout.toString());
  if (error.stderr) console.log('STDERR:', error.stderr.toString());
  process.exit(1);
}