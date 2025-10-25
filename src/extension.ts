/**
 * Copyright 2025 Terramate GmbH
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

import { 
	workspace, 
	ExtensionContext, 
	ConfigurationScope,
	WorkspaceConfiguration,
	window
} from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	Trace,
} from 'vscode-languageclient/node';

import { execSync } from 'child_process';
import { existsSync } from 'fs';

let client: LanguageClient;

export function activate(ctx: ExtensionContext) {
	const enabled = config("terramate").get<boolean>("languageServer.enabled", true);
	if (!enabled) {
		console.log("Terramate language server is disabled");
		return;
	}

	const serverInfo = getServerInfo(ctx);
	if (!serverInfo) {
		window.showWarningMessage(
			'Terramate language server (terramate-ls) not found. Please install it.',
			'Install Guide'
		).then(selection => {
			if (selection === 'Install Guide') {
				window.showInformationMessage(
					'Install terramate-ls from https://terramate.io/docs/cli/installation'
				);
			}
		});
		return;
	}

	const trace = config("terramate").get<string>("languageServer.trace.server", "off");

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'terramate' }],
		synchronize: {
			// TODO(i4k): investigate why this is needed.
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Apply trace setting if configured
	if (trace === "messages" || trace === "verbose") {
		clientOptions.traceOutputChannel = window.createOutputChannel("Terramate Language Server Trace");
	}

	client = new LanguageClient(
		'terramate',
		serverInfo.name,
		{
			command: serverInfo.path,
			args: serverInfo.args,
			options: { }
		},
		clientOptions
	);

	console.log(`Starting ${serverInfo.name} at: ${serverInfo.path}`);

	// Set trace level
	if (trace === "messages") {
		client.setTrace(Trace.Messages);
	} else if (trace === "verbose") {
		client.setTrace(Trace.Verbose);
	}

	// Start the client. This will also launch the server
	client.start().then(() => {
		console.log(`${serverInfo.name} started successfully`);
	}).catch((err) => {
		console.error(`Failed to start ${serverInfo.name}:`, err);
		window.showErrorMessage(`Failed to start ${serverInfo.name}: ${err.message}`);
	});
	
	ctx.subscriptions.push({
		dispose: () => client.stop()
	});
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

interface ServerInfo {
	name: string;
	path: string;
	args: string[];
}

function config(section: string, scope?: ConfigurationScope): WorkspaceConfiguration {
	return workspace.getConfiguration(section, scope);
}

function getServerInfo(context: ExtensionContext): ServerInfo | null {
	const customPath = config("terramate").get<string>("languageServer.binPath", "");
	const args = config("terramate").get<string[]>("languageServer.args", ["-mode=stdio"]);

	// If binPath is set, use it
	if (customPath) {
		if (!existsSync(customPath)) {
			console.error(`Language server binary not found: ${customPath}`);
			window.showErrorMessage(`Terramate language server not found at: ${customPath}`);
			return null;
		}
		
		console.log(`Using custom path for terramate-ls: ${customPath}`);
		
		return {
			name: "Terramate Language Server",
			path: customPath,
			args: args
		};
	}

	// No custom path - search for terramate-ls in PATH
	const lsPath = findBinary("terramate-ls");
	if (lsPath) {
		console.log("Auto-detected terramate-ls in PATH");
		return {
			name: "Terramate Language Server",
			path: lsPath,
			args: args
		};
	}

	console.error("terramate-ls not found in PATH");
	return null;
}

function findBinary(name: string): string | null {
	const ext = process.platform === 'win32' ? '.exe' : '';
	const binaryName = name + ext;

	try {
		// Try to find in PATH
		const which = process.platform === 'win32' ? 'where' : 'which';
		const result = execSync(`${which} ${binaryName}`, { encoding: 'utf-8' }).trim();
		const paths = result.split('\n');
		if (paths.length > 0 && paths[0]) {
			return paths[0];
		}
	} catch (err) {
		// Binary not in PATH
	}

	// Try bundled binary in extension's bin directory
	// (not implemented yet, but could be added for portability)

	return null;
}
