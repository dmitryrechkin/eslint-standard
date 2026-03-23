# Auto-Installation Options

## Manual Installation (Default - Recommended)

By default, peer dependencies are NOT auto-installed. After installing the package, run:

```bash
npx @dmitryrechkin/eslint-standard check-deps --install
```

## Environment Variable Control

You can control the installation behavior using environment variables:

### Enable Auto-Install

```bash
# One-time auto-install
ESLINT_STANDARD_AUTO_INSTALL=true npm install @dmitryrechkin/eslint-standard

# Or add to .npmrc for project
echo "ESLINT_STANDARD_AUTO_INSTALL=true" >> .npmrc
```

### Disable All Postinstall Messages

```bash
# Skip all postinstall scripts
ESLINT_STANDARD_SKIP_INSTALL=true npm install @dmitryrechkin/eslint-standard

# Or globally
npm install --ignore-scripts
```

## CI/CD Environments

The postinstall script automatically detects CI environments and skips execution to avoid issues.

## Security Considerations

- Auto-installation is **opt-in only** via environment variable
- Respects npm's `--ignore-scripts` flag
- Skips in CI environments
- Never modifies files without user consent

## Best Practices

1. **Development**: Use `check-deps --install` for quick setup
2. **Production**: Explicitly install peer dependencies in package.json
3. **CI/CD**: Add peer dependencies to your package.json for reproducible builds