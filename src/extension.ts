/**
 * Copyright 2022 Mineiros GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path = require('path');
import { 
	workspace, 
	ExtensionContext, 
	ConfigurationScope,
	WorkspaceConfiguration,
	commands,
	window,
	Uri,
 } from 'vscode';

 import * as vscode from 'vscode';

import {
	ExecuteCommandParams,
	ExecuteCommandRequest,
	LanguageClient,
	LanguageClientOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(ctx: ExtensionContext) {
	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'terramate' }],
		synchronize: {
			// TODO(i4k): investigate why this is needed.
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'terramate',
		'terramate',
		{
			command: getServerPath(ctx),
			args: getServerArgs(ctx),
			options: { }
		},
		clientOptions
	);

	console.log("terramate-ls path: "+getServerPath(ctx));

	const terramateStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

	ctx.subscriptions.push(vscode.commands.registerCommand('terramate.createStack', async (dir:vscode.Uri) => {
		terramateStatus.text = "Creating stack";
		terramateStatus.show();
		if (dir === undefined) {
			const selected = await vscode.window.showOpenDialog({
				title: "Select the directory for the stack creation",
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				defaultUri: vscode.workspace.workspaceFolders[0].uri,
				openLabel: "Create Stack"
			});
			if (selected) {
				dir = selected[0];
			} else {
				vscode.window.showErrorMessage("no file selected");
				terramateStatus.hide();
				return;
			}
		}
		const name = await vscode.window.showInputBox({
			title: "Name of the stack",
		});
		const desc = await vscode.window.showInputBox({
			title: "Description of the stack",
		});
		const val = await vscode.window.showQuickPick(["yes", "no"], {
			title: "Generate the stack.id with an UUID v4?",
		});
		try {
			const res = await createStackCommand(client, dir, name, desc, val == "yes");
			console.log(res);
		} catch (err) {
			await vscode.window.showErrorMessage(err.toString());
		}
		terramateStatus.hide();
	}));

	// Start the client. This will also launch the server
	ctx.subscriptions.push(client.start());
}

async function createStackCommand(client: LanguageClient, moduleUri: vscode.Uri, name: string, desc: string, genid = true): Promise<any> {
	const args = [
		`uri=${moduleUri.toString()}`,
	];
	if (name !== '') {
		args.push(`name=${name}`);
	} else {
		args.push(`name=${path.basename(moduleUri.path)}`);
	}
	if (desc !== '') {
		args.push(`description=${desc}`);
	}
	if (genid) {
		args.push(`genid=true`);
	}
	const requestParams: ExecuteCommandParams = {
		command: `terramate.createStack`, 
		arguments: args,
	};
	return execWorkspaceCommand(client, requestParams);
}

function execWorkspaceCommand(client: LanguageClient, params: ExecuteCommandParams): Promise<any> {
	return client.sendRequest(ExecuteCommandRequest.type, params);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function config(section: string, scope?: ConfigurationScope): WorkspaceConfiguration {
	return workspace.getConfiguration(section, scope);
}

function getServerPath(context: ExtensionContext): string {
	const binPath : string = config("terramate").get("languageServer.binPath");
	if (binPath && binPath != "") {
		return binPath;
	}

	let binName = "terramate-ls";
	if (process.platform === 'win32') {
		binName += ".exe";
	}

	return binName;
}

function getServerArgs(context: ExtensionContext): string[] {
	return config("terramate").get("languageServer.args");
}
