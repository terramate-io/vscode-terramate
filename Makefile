# Set default shell to bash
SHELL := /bin/bash -o pipefail -o errexit -o nounset

addlicense=go run github.com/google/addlicense@v1.0.0 \
	-ignore '**/*.yml' \
	-ignore '**/*.md' \
	-ignore '**/*.yaml' \
	-ignore 'node_modules/**' -ignore 'testFixture/**' \
	-ignore '.vscode-test/**' -ignore '.vscode/**' \
	-ignore 'pnpm-lock.yaml' -ignore '*.vsix'

terramate_ls_version=latest
terramate_ls_url=github.com/terramate-io/terramate/cmd/...@$(terramate_ls_version)

.PHONY: default
default: help

## install deps
.PHONY: deps
deps:
	pnpm install
	@if command -v go >/dev/null 2>&1; then \
		GOBIN=$(shell pwd)/bin go install -v "$(terramate_ls_url)" || echo "Warning: Failed to install terramate-ls, continuing..."; \
	else \
		echo "Warning: Go not found, skipping terramate-ls installation"; \
	fi

## build code
.PHONY: build
build: deps
	pnpm run compile

## lint code
.PHONY: lint
lint: deps
	pnpm run lint

## test extension (core features only)
.PHONY: test
test: VERSION?=stable
test: build
	sh ./scripts/e2e.sh $(VERSION) --grep "Syntax Recognition|Core LS"

## test extension with Pro features (requires Pro LS)
.PHONY: test-pro
test-pro: VERSION?=stable
test-pro: build
	sh ./scripts/e2e.sh $(VERSION)

## test extension on vscode minimal supported version.
.PHONY: test-min-version
test-min-version: build
	sh ./scripts/e2e.sh

## compile code without installing deps
.PHONY: compile
compile:
	pnpm run compile

## run quick test suite
.PHONY: test-quick
test-quick: compile
	./scripts/test-quick.sh

## package the extension
.PHONY: package
package:
	pnpm exec vsce package

## publish the extension in the official marketplace
.PHONY: publish-official
publish-official: check-vscode-access-token
	pnpm dlx @vscode/vsce publish -p $(VSCODE_ACCESS_TOKEN)

## publish the extension in the community marketplace
.PHONY: publish-community
publish-community: check-open-vsx-access-token
	pnpm dlx ovsx publish -p $(OPEN_VSX_ACCESS_TOKEN)

.PHONY: check-vscode-access-token
check-vscode-access-token:
ifndef VSCODE_ACCESS_TOKEN
	$(error VSCODE_ACCESS_TOKEN environment variable is not set)
endif

.PHONY: check-open-vsx-access-token
check-open-vsx-access-token:
ifndef OPEN_VSX_ACCESS_TOKEN
	$(error OPEN_VSX_ACCESS_TOKEN environment variable is not set)
endif

## add license to code
.PHONY: license
license:
	$(addlicense) -c "Terramate GmbH" .

## check if code is licensed properly
.PHONY: license/check
license/check:
	$(addlicense) --check . 2>/dev/null

## creates a new release tag
.PHONY: release/tag
release/tag: VERSION?=v$(shell npm pkg get version | tr -d '"')
release/tag:
	git tag -a $(VERSION) -m "Release $(VERSION)"
	git push origin $(VERSION)

## Display help for all targets
.PHONY: help
help:
	@awk '/^.PHONY: / { \
		msg = match(lastLine, /^## /); \
			if (msg) { \
				cmd = substr($$0, 9, 100); \
				msg = substr(lastLine, 4, 1000); \
				printf "  ${GREEN}%-30s${RESET} %s\n", cmd, msg; \
			} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
