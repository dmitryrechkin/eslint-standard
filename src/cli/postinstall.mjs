#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Don't run during local development
if (!__dirname.includes('node_modules')) {
	process.exit(0);
}

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🎉 Thanks for installing @dmitryrechkin/eslint-standard!    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📦 This package requires peer dependencies to work properly.

🚀 Quick install (auto-detects your package manager):
   ${'\x1b[36m'}npx @dmitryrechkin/eslint-standard install-deps${'\x1b[0m'}

📋 Or install manually:
   ${'\x1b[90m'}npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports @stylistic/eslint-plugin eslint-plugin-jsdoc eslint-plugin-simple-import-sort eslint-plugin-perfectionist${'\x1b[0m'}

🔍 To check if all dependencies are installed:
   ${'\x1b[36m'}npx @dmitryrechkin/eslint-standard check-deps${'\x1b[0m'}

📚 Documentation: https://github.com/dmitryrechkin/eslint-standard
`);

// Don't run check-deps in postinstall to avoid errors
// Users can run it manually with: npx @dmitryrechkin/eslint-standard check-deps