
# @dmitryrechkin/eslint-standard

This package provides a shared ESLint configuration which includes TypeScript support and a set of specific linting rules designed to ensure high-quality and consistent code style across projects. It utilizes the popular `@typescript-eslint` plugin to enforce TypeScript-specific best practices, along with rules for coding style and conventions.

## Features

- **TypeScript Support**: Integrated with `@typescript-eslint` for TypeScript specific linting.
- **Modern JavaScript Features**: Supports ECMAScript 2020 and newer.
- **Customizable**: Allows for specifying a custom `tsconfig.json` path.
- **Coding Guidelines**: Includes rules for brace styles, indentation, quotes, semicolons, and trailing spaces.
- **Naming Conventions**: Enforces naming conventions for various identifiers in your code.
- **Optimizations for Unused Imports**: Utilizes `eslint-plugin-unused-imports` to automatically detect and remove unused imports, keeping your code clean and efficient.

## Installation

To use this ESLint configuration in your project, first install the package and its peer dependencies (if they are not already installed):

```bash
npm install @dmitryrechkin/eslint-standard eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports --save-dev
```

## Usage

After installation, you can configure ESLint to use this configuration by creating an `.eslintrc.cjs` file in your project root with the following content:

```javascript
module.exports = require('@dmitryrechkin/eslint-standard')({
  tsconfigPath: './path/to/your/tsconfig.json' // Optional: specify the path to your tsconfig file
});
```

If you don't specify a `tsconfigPath`, the configuration will default to using `'./tsconfig.json'`.

### Overriding Rules

You can easily override any of the preset rules or add additional configurations by modifying the `.eslintrc.js` file in your project:

```javascript
module.exports = {
  ...require('@dmitryrechkin/eslint-standard')(),
  rules: {
    // Your overrides or additional rules here
    'no-console': 'error', // Example rule: Disallow the use of console.log
  }
};
```

## Adding Linting and Formatting Scripts

To add linting and formatting capabilities directly into your project's workflow, include the following scripts in your project's `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "format": "eslint . --ext .ts,.tsx --fix"
}
```

These commands will lint and format TypeScript files in your project according to the rules specified in this ESLint configuration. Adjust the file extensions and paths as needed to match your project's setup.

## Code Style Overview

This configuration enforces a specific coding style, exemplified below:

### Indentation and Braces

- **Allman Style Braces**: Where braces start on a new line.
- **Indentation**: Uses tabs for indentation.

**Example**:

```javascript
if (condition)
{
	doSomething();
}
else
{
	doSomethingElse();
}
```

### Naming Conventions

- **Variables and Functions**: camelCase without leading underscores.
- **Classes**: PascalCase without leading underscores.

**Example**:

```javascript
class UserProfile
{
	constructor(userName, userData)
	{
		this.userName = userName;
		this.userData = userData;
	}
	
	displayInfo()
	{
		console.log(`User: ${this.userName}`);
	}
}
```

### Semi-colons and Quotes

- **Semi-colons**: Required at the end of statements.
- **Quotes**: Single quotes for strings.

**Example**:

```javascript
const greeting = 'Hello, world!';
console.log(greeting);
```

## Contributing

Contributions to improve this ESLint configuration are welcome. Please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/dmitryrechkin/eslint-standard).


