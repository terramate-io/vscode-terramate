# Contributing to Terramate VSCode Extension

If you haven't done that yet, please read the
[Terramate Contributing Guide](https://github.com/terramate-io/terramate/blob/main/CONTRIBUTING.md) as the same process applies to this repository.

## Development

The `Makefile` has the automation for some useful tasks.
For a list of automations, just invoke `make` in the project's root directory:

```
$ make
  deps                           install deps
  build                          build code
  lint                           lint code
  test                           test code
  package                        package the extension
  publish-official               publish the extension in the official marketplace
  publish-community              publish the extension in the community marketplace
  license                        add license to code
  license/check                  check if code is licensed properly
  release/tag                    creates a new release tag
  help                           Display help for all targets
```

The `make deps` will install all dependencies needed for the `build`, `test`,
`package` and `publish-*` tasks.

### Running the extension locally

For executing and testing the extension manually, just follow the steps below:

1. Open the project's folder in the VSCode (`code <vscode-terramate-directory>`).
2. Run `make deps` to install all dependencies.
3. (Optional) Press **CTRL+SHIFT+B** and select the `watch` task (for automatic build of the extension each time the file is saved).
4. Open the `src/extension.ts` file in the editor.
5. Switch to the `Run and Debug View` in the Sidebar (**Ctrl+Shift+D**).
6. Select `Launch Client` from the drop down (if it is not already).
7. Press▷to run the launch config (or press **F5**).

After making the steps above, a new VSCode Window should have been open with the
extension installed. By opening any `.tm` or `.tm.hcl` file in this window will
activate the `Terramate` language mode for the file.

### Code organization

The repository contains a lot of files but most of them are boilerplate for
dependencies, testing, linting, build output, etc.

The important parts are:

- The file [package.json](https://github.com/mineiros-io/vscode-terramate/blob/main/package.json) contains a lot of important configurations.

- The [src](https://github.com/mineiros-io/vscode-terramate/tree/main/src) directory
contains the extension source code and the file `src/extension.ts` is the
extension entrypoint.

- The [src/test](https://github.com/mineiros-io/vscode-terramate/tree/main/src/test)
contains the e2e test infrastructure. In this directory, all the `*.test.js` files
are actual test suites. All the rest are testing setup.

- The [testFixture](https://github.com/mineiros-io/vscode-terramate/tree/main/testFixture)
directory contains fixtures used in tests.

- The [syntaxes](https://github.com/mineiros-io/vscode-terramate/tree/main/syntaxes)
directory contains the [TexMate Grammar Definition](https://macromates.com/manual/en/language_grammars) for the VSCode Intellisense integration.

The `make deps` command will download all the vscode and typescript libraries,
compilers and tools inside the "gitignored" `node_modules` directory, but also
build and install the [terramate language server](https://github.com/mineiros-io/terramate-ls) inside the `bin` directory.

### Submitting changes

Before submitting contributions, make sure the `make test` command shows that
all tests passed.

If everything is alright, then follow the process described in the [Terramate Contributing Guide](https://github.com/terramate-io/terramate/blob/main/CONTRIBUTING.md)
for this repository.

### Packaging

For packaging the extension you can simply execute:

```
make package
```

This will generate a file like `terramate-<version>.vsix`. This file alone can
be used to install the extension throught the `Install from VSIX...` button in
the *Extensions* panel in VSCode.

If the extension is working as expected, it can be published in the supported
marketplaces.

### Publishing the extension

At the moment there are two mainstream extension marketplaces for VSCode, the
official [Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode)
from Microsoft and the [Open VSX Registry](https://open-vsx.org/) from the
Eclipse Foundation, and the Terramate extension is published in both of them.

Before publishing the extension, someone need to setup an account, retrieve the
access tokens and setup up the publisher namespace (`Mineiros` is the official
namespace used in this repository).

If you have the access tokens for them already, you can proceed to publish it.

The commands `make publish-official` and `make publish-community` can be used to
publish the extension on the marketplaces (community is the *Open VSX* marketplace).
In order to execute the commands, you need to have the access tokens exported
in the environment variables `VSCODE_ACCESS_TOKEN` and `OPEN_VSX_ACCESS_TOKEN`,
for the official vscode marketplace and the community (open-vsx.org),
respectively.

If you don't have the access tokens yet or it's the first time you are going to
publish the extension, you can find below the links for each marketplace with
steps for setting up the namespaces:

- [Setup a VSCode Marketplace namespace](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)
- [Setup an Open VSX Account](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)

After following both processes, you will have two access tokens, one for each
marketplace.
