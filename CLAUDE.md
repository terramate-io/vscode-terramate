# Claude Guide for vscode-terramate

This guide helps Claude (and similar AI assistants) work effectively on the vscode-terramate project.

> **Note**: Read [agents.md](./agents.md) first for comprehensive project documentation. This file contains Claude-specific tips and workflow guidance.

## Quick Context

**Project**: VSCode extension for Terramate (Infrastructure-as-Code orchestration tool)  
**Language**: TypeScript  
**Key Components**: Syntax highlighting + LSP client for `terramate-ls`  
**Package Manager**: pnpm (preferred) or npm  
**Test Framework**: Mocha with VS Code test harness

## Common Request Patterns

### "Add support for X syntax/keyword"

**Approach:**
1. Edit `syntaxes/terramate.tmLanguage.json` to add TextMate grammar pattern
2. Add test fixture in `testFixture/` with example usage
3. Add test case in appropriate `*.test.ts` file
4. Run `pnpm test` to verify
5. Test manually with F5 (Extension Development Host)

**Example locations:**
- Block definitions: `"patterns"` → `"repository"` → `"blocks"`
- Keywords: `"repository"` → `"keywords"`
- String patterns: `"repository"` → `"strings"`

### "Fix bug in language server connection"

**Approach:**
1. Review `src/extension.ts` (all LSP logic is here)
2. Check server options (`serverOptions`) and client options (`clientOptions`)
3. Enable trace: `"terramate.languageServer.trace.server": "verbose"`
4. Test with Extension Development Host
5. Check Output panel: View → Output → "Terramate"

### "Add or update tests"

**Approach:**
1. Create/update fixture in `testFixture/` (organize by feature)
2. Add test using pattern from existing tests
3. Use helpers from `src/test/helper.ts`: `activate()`, `sleep()`, `testDiagnostics()`
4. Run specific suite: `pnpm test:syntax`, `pnpm test:core`, or `pnpm test:pro`
5. Run all: `pnpm test`

### "Update documentation"

**Files to update:**
- User-facing features → `README.md`
- Release process → Already documented in `README.md`
- Contributing guidelines → `CONTRIBUTING.md`
- AI assistant info → `agents.md` or this file

## File Editing Guidelines

### When editing `package.json`
- ✅ Use tabs for indentation (project standard)
- ✅ Validate JSON after changes
- ✅ Test with `pnpm install` if dependencies changed
- ✅ Check `publisher`, `version`, `name` remain consistent

### When editing `syntaxes/terramate.tmLanguage.json`
- ✅ Validate JSON (no trailing commas!)
- ✅ Test regex patterns carefully (TextMate/Oniguruma flavor)
- ✅ Reload VS Code window to see changes
- ✅ Add both positive and negative test cases

### When editing `src/extension.ts`
- ✅ Maintain TypeScript strict mode compliance
- ✅ Handle errors gracefully (extension shouldn't crash)
- ✅ Use `context.subscriptions.push()` for disposables
- ✅ Test both with and without `terramate-ls` in PATH

### When editing tests
- ✅ Use `async/await` pattern consistently
- ✅ Add `sleep()` delays for LSP operations (LSP is async)
- ✅ Clean up test fixtures if needed
- ✅ Name tests descriptively: `'should recognize X block syntax'`

## Running Commands

### Development
```bash
# Initial setup
pnpm install
pnpm compile

# Development loop
pnpm watch          # Auto-recompile on changes
# Press F5 to launch Extension Development Host
```

### Testing
```bash
# Full test suite (slow first run, downloads VS Code)
pnpm test

# Quick iteration (reuses downloaded VS Code)
sh ./scripts/test-quick.sh

# Specific suites
pnpm test:syntax    # Fast, no LSP required
pnpm test:core      # Requires terramate-ls
pnpm test:pro       # Requires Pro-enabled terramate-ls
```

### Release
```bash
# Bump version (creates commit + tag)
npm run version:patch    # or version:minor, version:major

# Push (triggers no automation yet)
git push && git push --tags

# Create GitHub release → triggers automated publishing
```

### Linting
```bash
pnpm lint
```

## Testing Strategy

### Test Files Overview
| File | Purpose | Requires LSP? |
|------|---------|---------------|
| `syntax.test.ts` | Basic language recognition | No |
| `lint.test.ts` | Error diagnostics | Yes |
| `languageserver.test.ts` | LSP startup & basic features | Yes |
| `lsp-positions.test.ts` | Go-to-definition, hover | Yes |
| `lsp-edge-cases.test.ts` | Complex LSP scenarios | Yes |
| `lsp-imports-workspace.test.ts` | Cross-file features | Yes |
| `bundle.test.ts` | Pro: bundle/component syntax | No |
| `generate.test.ts` | Generate block syntax | No |

### Writing Good Tests

**Pattern:**
```typescript
suite('Feature Name', () => {
  test('should do specific thing', async () => {
    const docUri = getDocUri('subfolder/file.tm');
    await activate(docUri);
    await sleep(2000); // Wait for LSP
    
    const doc = vscode.workspace.textDocuments.find(
      d => d.uri.toString() === docUri.toString()
    );
    
    assert.ok(doc);
    assert.strictEqual(doc.languageId, 'terramate');
  });
});
```

**Best practices:**
- Use descriptive test names
- One assertion per test (or closely related assertions)
- Add comments for non-obvious waits/delays
- Clean up test fixtures in `testFixture/` subdirectories
- Test both success and failure cases

## Debugging Tips

### Extension not activating?
1. Check `package.json` → `activationEvents` includes `onLanguage:terramate`
2. Verify file extension in `contributes.languages.extensions`
3. Check VS Code recognizes file (bottom-right status bar)

### Language server not starting?
1. Check `terramate-ls` in PATH: `which terramate-ls`
2. Enable trace: `"terramate.languageServer.trace.server": "verbose"`
3. Check Output panel: View → Output → "Terramate"
4. Look for spawn errors in extension host console

### Tests failing?
1. **"terramate-ls not found"** → Install or set `binPath` in test
2. **Timeout errors** → Increase `sleep()` duration (LSP may be slow)
3. **Unexpected diagnostics** → Check `terramate-ls` version compatibility
4. **File not found** → Verify path in `testFixture/`

### Syntax highlighting not working?
1. **After grammar changes** → Reload VS Code window (Cmd/Ctrl+Shift+P → "Reload Window")
2. **Regex not matching** → Test pattern in regex tester (use Oniguruma flavor)
3. **Scopes wrong** → Use "Developer: Inspect Editor Tokens and Scopes"

## Project Conventions

### Commit Messages
- `feat: add X feature` - New functionality
- `fix: resolve X issue` - Bug fixes  
- `chore: X` - Maintenance (deps, build, etc.)
- `docs: update X` - Documentation only
- `test: add X tests` - Test additions/changes
- `refactor: improve X` - Code improvements

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance

### Pull Request Process
1. Create branch from `main`
2. Make changes with commits
3. Run `pnpm lint` and `pnpm test`
4. Push branch and open PR
5. CI must pass (build, lint, test)
6. Get review from maintainer
7. Squash and merge to main

## Release Checklist

Before creating a release:

- [ ] All tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`  
- [ ] Manual testing in Extension Development Host
- [ ] **`CHANGELOG.md` updated**:
  - [ ] Move items from `[Unreleased]` to new version section
  - [ ] Add date in format: `[0.0.6] - YYYY-MM-DD`
  - [ ] Categorize changes: Added, Changed, Fixed, etc.
  - [ ] Update version links at bottom of file
  - [ ] Commit: `git commit -m "docs: update changelog for v0.0.6"`
- [ ] Version bumped: `npm run version:patch` (or minor/major)
- [ ] Changes pushed: `git push && git push --tags`
- [ ] GitHub release created with release notes (can copy from CHANGELOG)
- [ ] Monitor release workflow: [Actions tab](https://github.com/terramate-io/vscode-terramate/actions)
- [ ] Verify publishing: [Marketplace](https://marketplace.visualstudio.com/items?itemName=terramate.terramate)

## Common Gotchas

1. **TextMate grammar changes require VS Code reload** - "Reload Window" command
2. **Tests download VS Code on first run** - Takes time, use `test-quick.sh` for iterations
3. **LSP operations are async** - Always use `sleep()` in tests after operations
4. **Package.json uses tabs** - Maintain consistency
5. **Extension must be compiled** - Run `pnpm compile` before testing if TypeScript changed
6. **Test fixtures are shared** - Don't delete/modify without checking test dependencies
7. **Pro features need Pro LSP** - Some tests skip if Pro not available

## Performance Considerations

- Extension should activate quickly (lazy load when possible)
- Language server spawns on first `.tm` file open
- Syntax highlighting is fast (TextMate grammar)
- LSP features may have slight delay (server processing)

## Security Considerations

- Extension reads `terramate.languageServer.binPath` setting (user-provided path)
- Spawns external process (`terramate-ls`)
- No network requests from extension itself
- LSP may make network requests (Terramate Cloud features)

## Useful Resources

- **VS Code Extension API**: https://code.visualstudio.com/api
- **LSP Specification**: https://microsoft.github.io/language-server-protocol/
- **TextMate Grammars**: https://macromates.com/manual/en/language_grammars
- **Terramate Docs**: https://terramate.io/docs
- **Terramate GitHub**: https://github.com/terramate-io/terramate
- **Discord Community**: https://terramate.io/discord

## When in Doubt

1. Check existing patterns in the codebase
2. Run tests frequently: `pnpm test`
3. Test manually with F5
4. Check CI workflow for deployment requirements
5. Ask maintainers on Discord or GitHub issues

## File Priorities for Context

When loading context for a task, prioritize:

1. **Task-specific**:
   - Syntax → `syntaxes/terramate.tmLanguage.json`
   - LSP → `src/extension.ts`
   - Tests → relevant `src/test/*.test.ts` + `src/test/helper.ts`

2. **Always useful**:
   - `package.json` - Extension manifest
   - `README.md` - User docs
   - `agents.md` - This guide's companion

3. **Configuration**:
   - `tsconfig.json` - TypeScript config
   - `eslint.config.js` - Linting rules
   - `.github/workflows/*.yml` - CI/CD

4. **Test data**:
   - `testFixture/` - Browse subdirectories relevant to task

