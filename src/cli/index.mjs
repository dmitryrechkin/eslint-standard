#!/usr/bin/env node

const command = process.argv[2];

switch (command) {
	case 'install-deps':
		await import('./install-deps.mjs');
		break;
	case 'check-deps':
		await import('./check-deps.mjs');
		break;
	case 'lint':
		await import('./lint.mjs');
		break;
	case 'format':
		await import('./format.mjs');
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
  install-deps                  Install all peer dependencies
  check-deps                    Check if all peer dependencies are installed
  check-deps --install          Auto-install missing dependencies if any
  lint                          Run eslint with custom error message
  format                        Run eslint --fix with custom error message
  help                          Show this help message

Examples:
  npx @dmitryrechkin/eslint-standard install-deps
  npx @dmitryrechkin/eslint-standard check-deps
  npx @dmitryrechkin/eslint-standard check-deps --install
  npx @dmitryrechkin/eslint-standard lint .
  npx @dmitryrechkin/eslint-standard format .
		`);
		break;
	default:
		console.error(`Unknown command: ${command}`);
		console.log('Run "npx @dmitryrechkin/eslint-standard help" for usage information');
		process.exit(1);
}