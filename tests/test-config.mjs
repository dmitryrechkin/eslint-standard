import eslintStandardConfig from '../eslint.config.mjs';

export default eslintStandardConfig({
	files: ['tests/test-formatting.ts'],
	ignores: [],
	tsconfigPath: './tsconfig.json'
});