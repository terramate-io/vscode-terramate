# AI Assistant Guide for vscode-terramate

This document helps AI coding assistants understand the VSCode Terramate extension project structure, conventions, and best practices.

## Project Overview

**vscode-terramate** is the official Visual Studio Code extension for [Terramate](https://terramate.io), providing language support for Terramate configuration files.

### Key Features
- Syntax highlighting for `.tm`, `.tm.hcl`, and `.tmgen` files
- Language Server Protocol (LSP) integration with `terramate-ls`
- Real-time validation, autocomplete, hover documentation, and go-to-definition
- Support for both Terramate Core and Pro features (bundles, components, scaffolding)

### Technology Stack
- **Language**: TypeScript
- **Extension API**: VS Code Extension API
- **LSP Client**: `vscode-languageclient` (connects to `terramate-ls`)
- **Build**: TypeScript compiler (`tsc`)
- **Test**: Mocha with `@vscode/test-electron`
- **Package Manager**: pnpm (preferred) or npm

## Project Structure

```
vscode-terramate/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI: build, lint, test on PRs
│       └── release.yml      # Release: publish on GitHub releases
├── src/
│   ├── extension.ts         # Main extension entry point
│   └── test/                # E2E tests
│       ├── bundle.test.ts   # Bundle/component syntax tests
│       ├── generate.test.ts # Generate block tests
│       ├── languageserver.test.ts # LSP integration tests
│       ├── lint.test.ts     # Error detection tests
│       ├── lsp-*.test.ts    # Advanced LSP feature tests
│       ├── syntax.test.ts   # Basic syntax highlighting tests
│       └── helper.ts        # Test utilities
├── syntaxes/
│   └── terramate.tmLanguage.json # TextMate grammar for syntax highlighting
├── testFixture/             # Test files with various Terramate constructs
│   ├── bundles/
│   ├── components/
│   ├── globals/
│   ├── lsp/                 # LSP-specific test files
│   └── ...
├── bin/                     # Bundled terramate binaries for testing
├── out/                     # Compiled JavaScript (gitignored)
├── package.json             # Extension manifest & npm scripts
├── tsconfig.json            # TypeScript configuration
└── language-configuration.json # Bracket matching, comments, etc.
```

## Key Files

### `src/extension.ts`
Main extension logic:
- Activates on `.tm`, `.tm.hcl`, `.tmgen` files
- Spawns and manages `terramate-ls` language server
- Handles configuration (`terramate.languageServer.*` settings)
- Implements LSP client communication

### `syntaxes/terramate.tmLanguage.json`
TextMate grammar defining syntax highlighting rules:
- Block patterns (terramate, stack, globals, generate_*, etc.)
- Pro features (bundle, component, scaffolding)
- Keywords, strings, comments, variables
- **Format**: JSON with regex patterns

### `package.json`
Extension manifest:
- Publisher: `terramate`
- Activation: `onLanguage:terramate`
- Configuration contributions
- File associations
- Commands and scripts

### `testFixture/*`
Real Terramate files used in tests:
- Cover all language constructs
- Include valid and invalid examples
- Used for syntax recognition and LSP tests

## Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm compile

# Watch mode (auto-recompile)
pnpm watch
```

### Testing
```bash
# Run all E2E tests
pnpm test

# Run specific test suites
pnpm test:syntax    # Syntax recognition only
pnpm test:core      # Core LSP features
pnpm test:pro       # Pro features (bundles/components)

# Quick test (no re-download of VS Code)
sh ./scripts/test-quick.sh
```

### Running the Extension Locally
1. Open project in VS Code
2. Press `F5` or Run → Start Debugging
3. New "Extension Development Host" window opens
4. Open a folder with `.tm` files to test

### Linting
```bash
pnpm lint
```

Uses ESLint with TypeScript rules. Configuration in `eslint.config.js`.

## Testing Strategy

### E2E Tests with VS Code Test Harness
All tests use `@vscode/test-electron` to launch VS Code and test real extension behavior.

**Test Structure:**
```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Test Suite Name', () => {
  test('test description', async () => {
    const doc = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(doc);
    // Test assertions
  });
});
```

### Test Categories

1. **Syntax Tests** (`syntax.test.ts`)
   - Verify files recognized as `terramate` language
   - Check basic activation

2. **Linting Tests** (`lint.test.ts`)
   - Open invalid files from `testFixture/invalid/`
   - Assert diagnostics appear with correct messages
   - Requires `terramate-ls` in PATH

3. **LSP Tests** (`languageserver.test.ts`, `lsp-*.test.ts`)
   - Test hover, completion, definition, references
   - Use `testFixture/lsp/` files
   - Requires `terramate-ls` in PATH

4. **Bundle/Component Tests** (`bundle.test.ts`, `generate.test.ts`)
   - Test Pro syntax recognition
   - Use `testFixture/bundles/`, `testFixture/components/`

### Test Utilities (`helper.ts`)
- `sleep(ms)`: Wait for LSP operations
- `getDocUri(path)`: Get URI for test fixtures
- `activate(docUri)`: Open document and activate extension
- `testDiagnostics(docUri, expected)`: Assert diagnostics

## Release Process

### 1. Update CHANGELOG

Before bumping the version, update `CHANGELOG.md`:

```bash
# Edit CHANGELOG.md
# - Move items from [Unreleased] to new version section
# - Add date in format: [0.0.6] - YYYY-MM-DD
# - Categorize changes: Added, Changed, Fixed, Removed, etc.
# - Update version links at bottom of file

# Commit the changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for v0.0.6"
```

### 2. Version Bumping
```bash
# Patch: 0.0.5 → 0.0.6 (bug fixes)
npm run version:patch

# Minor: 0.0.5 → 0.1.0 (new features)
npm run version:minor

# Major: 0.0.5 → 1.0.0 (breaking changes)
npm run version:major
```

This:
1. Updates `package.json` version
2. Creates git commit: `chore: bump version to X.X.X`
3. Creates git tag: `vX.X.X`

### 3. Publishing
```bash
# Push changes and tags
git push && git push --tags

# Create GitHub release at:
# https://github.com/terramate-io/vscode-terramate/releases/new
```

**Automated workflow** (`.github/workflows/release.yml`):
1. Builds and compiles extension
2. Runs lint and tests
3. Creates VSIX package
4. Uploads VSIX to GitHub release
5. Publishes to VS Code Marketplace (if `VSCODE_ACCESS_TOKEN` set)
6. Publishes to Open VSX Registry (if `OPEN_VSX_ACCESS_TOKEN` set)

## Configuration

Extension settings under `terramate.languageServer.*`:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable language server |
| `binPath` | string | `""` | Custom path to `terramate-ls` binary |
| `args` | array | `["-mode=stdio"]` | Arguments for `terramate-ls` |
| `trace.server` | enum | `"off"` | LSP trace level (off/messages/verbose) |

## Code Conventions

### TypeScript
- Use strict mode
- Async/await for asynchronous operations
- ES6+ features
- Explicit types where helpful

### Extension Lifecycle
```typescript
export function activate(context: vscode.ExtensionContext) {
  // Register language client
  // Start language server
  // Register commands/providers
}

export function deactivate() {
  // Cleanup
  // Stop language server
}
```

### LSP Client Pattern
```typescript
const client = new LanguageClient(
  'terramate',
  'Terramate Language Server',
  serverOptions,
  clientOptions
);

context.subscriptions.push(client.start());
```

## Common Tasks

### Adding Syntax Highlighting for New Keywords
1. Edit `syntaxes/terramate.tmLanguage.json`
2. Add pattern to appropriate repository section
3. Test with sample file
4. Add test case to `syntax.test.ts`

### Adding Test Cases
1. Create fixture file in `testFixture/` (appropriate subdirectory)
2. Add test in relevant `*.test.ts` file
3. Use helper functions from `helper.ts`
4. Run `pnpm test` to verify

### Updating Language Server Integration
1. Modify `src/extension.ts`
2. Update server options or client options
3. Test with LSP trace enabled: `"terramate.languageServer.trace.server": "verbose"`
4. Check output in VS Code: View → Output → "Terramate"

### Updating Documentation
- User docs: `README.md`
- Release process: `README.md` (Release Process section)
- Contributing: `CONTRIBUTING.md`
- This file: `agents.md` or `claude.md`

## Debugging

### Extension Debugging
1. Set breakpoints in TypeScript files
2. Press `F5` to launch Extension Development Host
3. Debugger attaches automatically
4. Use Debug Console in host VS Code

### Language Server Debugging
1. Enable verbose trace:
   ```json
   {
     "terramate.languageServer.trace.server": "verbose"
   }
   ```
2. Check Output panel: View → Output → "Terramate"
3. Look for request/response messages and errors

### Test Debugging
1. Open test file in VS Code
2. Set breakpoints
3. Run → Start Debugging (select "VS Code Extension Tests")
4. Tests run with debugger attached

## Dependencies

### Runtime
- `vscode`: VS Code Extension API (provided by host)
- `vscode-languageclient`: LSP client library

### Development
- `typescript`: TypeScript compiler
- `@vscode/test-electron`: VS Code test harness
- `@vscode/vsce`: Packaging tool
- `ovsx`: Open VSX publishing
- `mocha`: Test framework
- `eslint`: Linting

### External
- `terramate-ls`: Language server binary (must be in PATH or configured via `binPath`)

## Important Notes

1. **Binary bundles**: `bin/` contains `terramate`, `terramate-ls`, `tgdeps` binaries for CI testing
2. **Test fixtures**: Never delete files in `testFixture/` without checking test dependencies
3. **Syntax grammar**: Changes to `terramate.tmLanguage.json` require VS Code reload to take effect
4. **LSP features**: Depend on `terramate-ls` version and capabilities
5. **Pro features**: Bundle/component support requires Pro-enabled `terramate-ls`

## CI/CD

### CI Workflow (`.github/workflows/ci.yml`)
Runs on: PRs, pushes to main
- Installs Node.js, Go (for building binaries)
- Runs `pnpm install`, `pnpm compile`, `pnpm lint`
- Runs `pnpm test`
- Builds test binaries

### Release Workflow (`.github/workflows/release.yml`)
Triggers on: GitHub release published
- Builds extension
- Creates VSIX package
- Publishes to marketplaces

## Getting Help

- **Terramate Docs**: https://terramate.io/docs
- **VS Code Extension API**: https://code.visualstudio.com/api
- **LSP Specification**: https://microsoft.github.io/language-server-protocol/
- **Discord**: https://terramate.io/discord

## Making Changes Safely

1. ✅ Always run `pnpm test` before committing
2. ✅ Update tests when adding features
3. ✅ Run `pnpm lint` and fix issues
4. ✅ Test manually with Extension Development Host
5. ✅ Update README.md if user-facing changes
6. ✅ Add entries to CHANGELOG.md for releases
7. ✅ Check CI passes before merging PRs

