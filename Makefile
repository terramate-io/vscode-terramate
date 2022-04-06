# Set default shell to bash
SHELL := /bin/bash -o pipefail -o errexit -o nounset

addlicense=go run github.com/google/addlicense@v1.0.0 -ignore **/*.yml \
	-ignore '**/node_modules/*'

terramate_lsp_version=i4k-skeleton
terramate_lsp_url=github.com/mineiros-io/terramate-lsp/cmd/terramate-lsp@$(terramate_lsp_version)
go_install_dir=$(shell go env GOPATH)/bin

.PHONY: default
default: help

## install deps
.PHONY: deps
deps:
	npm install
	go install "$(terramate_lsp_url)"
	cp -v $(go_install_dir)/terramate-lsp ./bin

## build code
.PHONY: build
build: deps
	npm run compile

## lint code
.PHONY: lint
lint: deps
	npm run lint

## test code
.PHONY: test
test: build
	npm run test

## add license to code
.PHONY: license
license:
	$(addlicense) -c "Mineiros GmbH" .

## check if code is licensed properly
.PHONY: license/check
license/check:
	$(addlicense) --check .

## creates a new release tag
.PHONY: release/tag
release/tag: VERSION?=v$(shell cat VERSION)
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
