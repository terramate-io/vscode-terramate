#!/bin/bash
# Copyright 2025 Terramate GmbH
# SPDX-License-Identifier: Apache-2.0
#
# Quick test script for the Terramate VSCode extension
# Run this before releasing to catch common issues

set -e -o pipefail

echo "🧪 Terramate VSCode Extension - Test Suite"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_step() {
    echo -n "  Testing: $1... "
}

test_pass() {
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED=$((PASSED + 1))
}

test_fail() {
    echo -e "${RED}❌ FAIL${NC}"
    echo "    Error: $1"
    FAILED=$((FAILED + 1))
}

echo "📋 Step 1: Dependencies"
test_step "pnpm installed"
if command -v pnpm &> /dev/null; then
    test_pass
else
    test_fail "pnpm not found. Install with: npm install -g pnpm"
fi

test_step "node_modules present"
if [ -d "node_modules" ]; then
    test_pass
else
    echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
    pnpm install
    test_pass
fi

echo ""
echo "🔨 Step 2: Build"
test_step "TypeScript compilation"
if pnpm compile 2>&1 | grep -q "tsc -b"; then
    test_pass
else
    test_fail "Compilation failed"
fi

test_step "Output files generated"
if [ -f "out/extension.js" ]; then
    test_pass
else
    test_fail "out/extension.js not found"
fi

echo ""
echo "🔍 Step 3: Code Quality"
test_step "ESLint check"
if pnpm lint &> /dev/null; then
    test_pass
else
    test_fail "Linting failed"
fi

test_step "Grammar JSON validity"
if python3 -m json.tool syntaxes/terramate.tmLanguage.json > /dev/null 2>&1; then
    test_pass
else
    test_fail "Grammar JSON is invalid"
fi

echo ""
echo "📦 Step 4: Package Structure"
test_step "Required files present"
REQUIRED_FILES=("package.json" "README.md" "LICENSE" "syntaxes/terramate.tmLanguage.json" "out/extension.js")
ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        ALL_PRESENT=false
        echo "    Missing: $file"
    fi
done
if $ALL_PRESENT; then
    test_pass
else
    test_fail "Some required files are missing"
fi

test_step "Test fixtures present"
if [ -d "testFixture/bundles" ] && [ -d "testFixture/components" ]; then
    test_pass
else
    test_fail "Test fixtures incomplete"
fi

echo ""
echo "🧬 Step 5: Extension Package"
test_step "Can create VSIX package"
if pnpm exec vsce package --no-dependencies 2>&1 | grep -q "DONE"; then
    test_pass
else
    test_fail "VSIX packaging failed"
fi

test_step "VSIX file created"
if ls terramate-*.vsix 1> /dev/null 2>&1; then
    VSIX_FILE=$(ls terramate-*.vsix)
    VSIX_SIZE=$(du -h "$VSIX_FILE" | cut -f1)
    echo -e "${GREEN}✅ PASS${NC} (Size: $VSIX_SIZE)"
    ((PASSED++))
else
    test_fail "VSIX file not found"
fi

echo ""
echo "📊 Test Summary"
echo "==========================================="
echo -e "  Passed: ${GREEN}$PASSED${NC}"
echo -e "  Failed: ${RED}$FAILED${NC}"
echo "==========================================="

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All automated tests passed!${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Test manually: Press F5 in VSCode"
    echo "  2. Open test fixtures in Extension Development Host"
    echo "  3. Test with both language servers"
    echo "  4. Install VSIX locally: code --install-extension $VSIX_FILE"
    echo "  5. When ready: make publish-official"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Fix issues before releasing.${NC}"
    echo ""
    exit 1
fi


