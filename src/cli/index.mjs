#!/usr/bin/env node

const command = process.argv[2];

switch (command) {
	case 'install-deps':
		await import('./install-deps.mjs');
		break;
	case 'check-deps':
		await import('./check-deps.mjs');
		break;
	case 'help':
	case '--help':
	case '-h':
	case undefined:
		console.log(`
@dmitryrechkin/eslint-standard CLI

Usage:
  npx @dmitryrechkin/eslint-standard <command>

Commands:
  install-deps         Install all peer dependencies
  check-deps           Check if all peer dependencies are installed
  check-deps --install Auto-install missing dependencies if any
  help                 Show this help message

Examples:
  npx @dmitryrechkin/eslint-standard install-deps
  npx @dmitryrechkin/eslint-standard check-deps
  npx @dmitryrechkin/eslint-standard check-deps --install
		`);
		break;
	default:
		console.error(`Unknown command: ${command}`);
		console.log('Run "npx @dmitryrechkin/eslint-standard help" for usage information');
		process.exit(1);
}