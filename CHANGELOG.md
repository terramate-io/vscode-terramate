# Changelog

All notable changes to the Terramate VSCode Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed extension activation error by including `vscode-languageclient` runtime dependency in VSIX package. Previously, the `--no-dependencies` flag in the release workflow excluded all node_modules, causing "Cannot find module 'vscode-languageclient/node'" error on installation.

## [0.0.6] - 2025-01-14

### Added
- 🚀 Automated release workflow via GitHub releases
- 📚 AI assistant documentation (`agents.md`, `claude.md`)
- 📝 Comprehensive release process documentation in README
- ⚙️ npm version bump scripts (version:patch, version:minor, version:major)
- 🎨 Updated extension icon

### Changed
- Streamlined release workflow to trigger only on GitHub releases
- Improved CHANGELOG format following Keep a Changelog standard

## [0.0.5] - 2024

### Added
- Full syntax highlighting for Terramate language constructs
- Support for core blocks: `terramate`, `stack`, `globals`, `generate_hcl`, `generate_file`, `assert`, `output`, `script`, `vendor`, `sharing_backend`
- Support for Pro blocks: `define bundle`, `define component`, `scaffolding`
- Language Server Integration with `terramate-ls`
- Real-time validation and error checking
- Smart autocomplete with context-aware suggestions
- Hover documentation for inline help
- Go to definition navigation
- Diagnostics with error and warning reporting
- Bundle and component support (depends on `terramate-ls` version)

### Fixed
- File association handling for Terramate-specific HCL files
- Language server auto-detection in PATH

## [0.0.4] - Earlier

### Added
- Initial release of Terramate VSCode Extension
- Basic syntax highlighting
- File extension support

## [0.0.3] - Earlier

### Added
- Core language features
- Basic LSP integration

## [0.0.2] - Earlier

### Added
- Improved syntax highlighting
- Bug fixes

## [0.0.1] - Earlier

### Added
- Initial proof of concept
- Basic Terramate file support

---

## Release Types

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

[Unreleased]: https://github.com/terramate-io/vscode-terramate/compare/v0.0.6...HEAD
[0.0.6]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.6
[0.0.5]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.5
[0.0.4]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.4
[0.0.3]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.3
[0.0.2]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.2
[0.0.1]: https://github.com/terramate-io/vscode-terramate/releases/tag/v0.0.1

