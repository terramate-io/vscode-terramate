# Terramate VSCode Extension

![CI Status](https://github.com/terramate-io/vscode-terramate/actions/workflows/ci.yml/badge.svg)
[![Join Discord](https://img.shields.io/discord/1088753599951151154?label=Discord&logo=discord&logoColor=white)](https://terramate.io/discord)

This is the official [Terramate](https://github.com/terramate-io/terramate) extension for [Visual Studio Code](https://code.visualstudio.com/).

If you are new to Terramate, [this article](https://terramate.io/rethinking-iac/how-terramate-can-improve-your-infrastructure-management/) provides an overview of the project and how it improve Terraform and OpenTofu workflows.

## Getting Started

### Step 1: Install the Terramate Language Server

Install `terramate-ls`:
- **[Official installation guide](https://terramate.io/docs/cli/installation)**
- Or via Homebrew: `brew install terramate-io/tap/terramate`

The extension automatically detects `terramate-ls` in your PATH.

### Step 2: Install the Extension

Install the [Terramate Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=Mineiros.terramate) or search for `Terramate` in the VSCode Extensions Panel (**Ctrl/Cmd+Shift+X**).

### Step 3: Start Coding

Open any folder containing Terramate files. Files with `.tm` or `.tm.hcl` extensions will automatically activate the extension with full syntax highlighting and language server features.

## Features

### Syntax Highlighting

Full syntax highlighting for all Terramate language constructs:
- **Core blocks**: `terramate`, `stack`, `globals`, `generate_hcl`, `generate_file`, `assert`, `output`, `script`, `vendor`, `sharing_backend`, and more
- **Pro blocks**: `define bundle`, `define component`, `scaffolding`  

### Language Server Integration

When `terramate-ls` is installed, you get:

- ✅ **Real-time validation** - Catch errors as you type
- ✅ **Smart autocomplete** - Context-aware suggestions
- ✅ **Hover documentation** - Inline help
- ✅ **Go to definition** - Navigate your code
- ✅ **Diagnostics** - Error and warning reporting

**Bundle/Component Support**: Depends on your `terramate-ls` version. Language servers built from repositories with Pro features include full bundle and component validation.

## Configuration

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `terramate.languageServer.enabled` | `true` | Enable/disable language server |
| `terramate.languageServer.binPath` | `""` | Custom path to terramate-ls |
| `terramate.languageServer.args` | `["-mode=stdio"]` | Arguments for terramate-ls |
| `terramate.languageServer.trace.server` | `"off"` | LSP trace level (off/messages/verbose) |

### Examples

**Default (Auto-detect)**
```json
{
  // No configuration needed - finds terramate-ls in PATH automatically
}
```

**Custom Binary Path**
```json
{
  "terramate.languageServer.binPath": "/custom/path/to/terramate-ls"
}
```

**Disable Language Server** (Syntax highlighting only)
```json
{
  "terramate.languageServer.enabled": false
}
```

**Debug Language Server Issues**
```json
{
  "terramate.languageServer.trace.server": "verbose"
}
```
View logs in: View → Output → Select "Terramate"

## File Associations

If you have `*.hcl` files associated with another extension (e.g., Terraform), you can add Terramate-specific associations:

**Settings → Text Editor → Files → Associations** or in `settings.json`:

```json
{
  "files.associations": {
    "*.tm.hcl": "terramate",
    "*.tm": "terramate"
  }
}
```

## Troubleshooting

### Language Server Not Starting

1. **Check if terramate-ls is installed**:
   ```bash
   which terramate-ls
   terramate-ls --version
   ```

2. **Check VSCode Output panel**:
   - View → Output
   - Select "Terramate" from dropdown
   - Look for error messages

3. **Try custom path**:
   ```json
   {
     "terramate.languageServer.binPath": "/full/path/to/terramate-ls"
   }
   ```

### Syntax Highlighting Not Working

1. Check the file is recognized as Terramate (bottom right of VSCode)
2. Try reloading VSCode
3. Check file extension is `.tm` or `.tm.hcl`

## Contributing

To contribute to this project, please read:
- [Terramate Contributing Guide](https://github.com/terramate-io/terramate/blob/main/CONTRIBUTING.md)
- [CONTRIBUTING.md](https://github.com/terramate-io/vscode-terramate/blob/main/CONTRIBUTING.md) (extension-specific)

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.
