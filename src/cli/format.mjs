
import { spawn } from 'node:child_process';

const args = process.argv.slice(3); // First 3 are node, script, command

console.log('Running formatting...');

// Determine eslint command (npx eslint or just eslint if in path)
// We inject --fix to enable auto-fixing/formatting
const eslint = spawn('npx', ['eslint', '--fix', ...args], {
	stdio: 'inherit',
	shell: true
});

eslint.on('close', (code) => {
	if (code !== 0) {
		console.log('\n\x1b[33m%s\x1b[0m', 'formatting completed with issues. please address remaining errors and warnings manually, make sure everything builds and all tests pass after modifying the code');
		process.exit(code);
	} else {
		console.log('\n✅ Formatting passed');
	}
});
