import eslintStandardConfig from '../eslint.config.mjs';

export default eslintStandardConfig({
	files: ['tests/**/*.ts'],
	ignores: [],
	tsconfigPath: './tests/tsconfig.json'
});