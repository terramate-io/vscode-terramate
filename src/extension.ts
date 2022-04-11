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

import * as path from 'path';

import { 
	workspace, 
	ExtensionContext, 
	ConfigurationScope,
	WorkspaceConfiguration
 } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
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
			command: getServerPath(context),
			args: getServerArgs(context),
			options: { }
		},
		clientOptions
	);

	// Start the client. This will also launch the server
	context.subscriptions.push(client.start());
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function installPath(context: ExtensionContext): string {
	return path.join(context.extensionPath, "bin");
}

function config(section: string, scope?: ConfigurationScope): WorkspaceConfiguration {
	return workspace.getConfiguration(section, scope);
}

function getServerPath(context: ExtensionContext): string {
	const binPath : string = config("terramate").get("languageServer.binPath");
	if (binPath && binPath != "") {
		return binPath;
	}

	return path.join(installPath(context), "terramate-lsp");
}

function getServerArgs(context: ExtensionContext): string[] {
	return config("terramate").get("languageServer.args");
}
