/**
 * Copyright 2022 Google LLC
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
	// TODO(i4k): get from configuration or installation dir.
	const serverPath = path.join(installPath(context), "terramate-lsp");

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'terramate' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'terramate',
		'terramate',
		{
			command: serverPath,
			args: ['-mode=stdio'],
			options: { }
		},
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

export function installPath(context: ExtensionContext): string {
	return path.join(context.extensionPath, "bin");
}

export function config(section: string, scope?: ConfigurationScope): WorkspaceConfiguration {
	return workspace.getConfiguration(section, scope);
}