# Terramate VSCode Extension

![CI Status](https://github.com/mineiros-io/vscode-terramate/actions/workflows/ci.yml/badge.svg)
[![Join Slack](https://img.shields.io/badge/slack-@mineiros--community-f32752.svg?logo=slack)](https://mineiros.io/slack)

This is the official [Terramate](https://github.com/mineiros-io/terramate)
extension for [Visual Studio Code](https://code.visualstudio.com/) editor.

If you are new to Terramate, [this article](https://blog.mineiros.io/introducing-terramate-an-orchestrator-and-code-generator-for-terraform-5e538c9ee055)
provides an overview of the project and how it improves the Terraform workflow.

## Getting started

* **Step 1**: Install the [Terramate Language Server](https://github.com/mineiros-io/terramate-ls).

* **Step 2**: Install the [Terramate Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=Mineiros.terramate) or search for `Terramate` in
the VSCode Extensions Panel (**CTRL+SHIFT+X**).

If you have installed the `terramate-ls` in an arbitrary path (not in `PATH` env)
you can configure where the extension should look up for the binary using the
setting `terramate.languageServer.binPath` in 
[settings.xml](https://code.visualstudio.com/docs/getstarted/settings).

* **Step 3**: To activate the extension, open any folder or VS Code workspace 
containing Terramate files. Any `.tm` or `.tm.hcl` file open will have the
"Language mode" set to `Terramate`.

If you have `*.hcl` associated with other extension (eg.: terraform) you can
add a specific file association for terramate in the `Settings -> Text Editor -> Files -> Associations` 
or directly updating/adding the `files.associations` in the `settings.json`:

```
"files.associations": {
	"*.tm.hcl": "terramate"
}
```
