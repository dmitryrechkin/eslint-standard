
import { spawn } from 'node:child_process';

const args = process.argv.slice(3); // First 3 are node, script, command

console.log('Running linting...');

// Determine eslint command (npx eslint or just eslint if in path)
const eslint = spawn('npx', ['eslint', ...args], {
	stdio: 'inherit',
	shell: true
});

eslint.on('close', (code) => {
	if (code !== 0) {
		console.log('\n\x1b[33m%s\x1b[0m', 'please address all the errors and warnings and re-run linting after, make sure everything builds and all tests pass after modifying the code');
		process.exit(code);
	}
});
