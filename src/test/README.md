# Test Suite Documentation

## Test Organization

Tests are organized by requirement level to allow flexible testing with different language server builds.

---

## Test Files

### 1. `syntax.test.ts` - Syntax Recognition (4 tests)
**Requirements**: NONE  
**Validates**: VSCode extension recognizes Terramate files

```bash
pnpm test:syntax
```

**Always passes** - Tests extension only, not language server

---

### 2. Core LS Tests (12 tests)

#### `lint.test.ts` - Error Detection (4 tests)
**Requirements**: terramate-ls (any version)  
**Validates**: LS detects invalid syntax

#### `generate.test.ts` - Core Features (5 tests)
**Requirements**: terramate-ls (any version)  
**Validates**: generate_hcl, generate_file, globals, config, stack

#### `languageserver.test.ts` - Integration (3 tests)
**Requirements**: terramate-ls (any version)  
**Validates**: LS starts, integrates correctly, provides diagnostics

```bash
pnpm test:core
```

**Should pass** with open-source terramate-ls

---

### 3. `bundle.test.ts` - Pro Features (5 tests)
**Requirements**: terramate-ls **with Pro features**  
**Validates**: Bundle and component blocks are recognized by LS

```bash
pnpm test:pro
```

**Expected behavior**:
- ✅ **PASS** with Pro-enhanced terramate-ls
- ❌ **FAIL** with open-source terramate-ls (expected!)

**Failure message**: `"unrecognized block 'define'/'bundle'/'component'"`

---

## Running Tests

### All Tests (Including Pro)
```bash
pnpm test
# or
sh ./scripts/e2e.sh
```

**Result with open-source LS**: 16/21 pass, 5 Pro tests fail ✅ (expected)  
**Result with Pro LS**: 21/21 pass ✅

---

### Syntax + Core Only (Default for CI)
```bash
make test
# or
pnpm test:syntax && pnpm test:core
```

**Result**: 16/16 pass ✅  
**Use in**: CI/CD (doesn't require Pro LS)

---

### Pro Tests Only
```bash
pnpm test:pro
```

**Result with open-source LS**: 5/5 fail (expected!)  
**Result with Pro LS**: 5/5 pass ✅

**Use when**: Validating Pro LS build

---

## CI/CD Strategy

### Default CI (`.github/workflows/ci.yml`)
```yaml
# Only runs Syntax + Core tests
run: sh ./scripts/e2e.sh --grep "Syntax Recognition|Core LS"
```

**Why**: Works with open-source terramate-ls (installed in CI)  
**Coverage**: Validates 16/21 tests (core functionality)

### Optional Pro CI
```yaml
# Add separate job for Pro features (when Pro LS is available)
test-pro-features:
  steps:
    - name: Setup Pro LS
      run: # build or download Pro-enhanced terramate-ls
    - name: Run Pro tests
      run: pnpm test:pro
```

**When**: When you want to validate Pro features in CI

---

## Test Results by LS Version

### With Open Source terramate-ls

| Suite | Tests | Pass | Fail | Notes |
|-------|-------|------|------|-------|
| Syntax Recognition | 4 | 4 ✅ | 0 | Extension only |
| Core LS | 12 | 12 ✅ | 0 | Core features |
| Pro Features | 5 | 0 | 5 ❌ | **Expected!** |
| **Total** | **21** | **16** | **5** | ✅ Correct |

### With Pro-Enhanced terramate-ls

| Suite | Tests | Pass | Fail | Notes |
|-------|-------|------|------|-------|
| Syntax Recognition | 4 | 4 ✅ | 0 | Extension only |
| Core LS | 12 | 12 ✅ | 0 | Core features |
| Pro Features | 5 | 5 ✅ | 0 | Full support! |
| **Total** | **21** | **21** | **0** | ✅ Perfect |

---

## Summary

**Current implementation**: ✅ Tests correctly validate LS capabilities

- **Syntax tests**: Always pass (no LS needed)
- **Core tests**: Pass with any terramate-ls
- **Pro tests**: **Fail** with open-source LS, **pass** with Pro LS

**This is exactly the right behavior!** 🎉

The test suite now accurately reflects what each language server version supports.

