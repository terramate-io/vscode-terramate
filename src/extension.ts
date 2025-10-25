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
			'Terramate language server not found. Please install terramate-ls or terramate-pro.',
			'Install Guide'
		).then(selection => {
			if (selection === 'Install Guide') {
				window.showInformationMessage(
					'Install terramate-ls (open source) or terramate-pro for full bundle support. ' +
					'Visit https://terramate.io/docs/cli/installation for instructions.'
				);
			}
		});
		return;
	}

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'terramate' }],
		synchronize: {
			// TODO(i4k): investigate why this is needed.
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

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

	// Start the client. This will also launch the server
	client.start().then(() => {
		console.log(`${serverInfo.name} started successfully`);
		if (serverInfo.type === 'terramate-pro') {
			console.log("Using Terramate Pro - full bundle support enabled");
		} else if (serverInfo.type === 'terramate-ls') {
			console.log("Using terramate-ls (open source) - limited bundle support");
		}
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
	type: 'terramate-ls' | 'terramate-pro' | 'custom';
}

function config(section: string, scope?: ConfigurationScope): WorkspaceConfiguration {
	return workspace.getConfiguration(section, scope);
}

function getServerInfo(context: ExtensionContext): ServerInfo | null {
	const serverType = config("terramate").get<string>("languageServer.type", "auto");
	const customPath = config("terramate").get<string>("languageServer.binPath", "");
	const args = config("terramate").get<string[]>("languageServer.args", ["-mode=stdio"]);

	// If binPath is set, use it regardless of type
	if (customPath) {
		if (!existsSync(customPath)) {
			console.error(`Language server binary not found: ${customPath}`);
			window.showErrorMessage(`Terramate language server not found at: ${customPath}`);
			return null;
		}
		
		// Detect type from binary name if type is auto
		let detectedType: 'terramate-ls' | 'terramate-pro' | 'custom' = 'custom';
		let serverArgs = args;
		
		if (customPath.includes('terramate-pro')) {
			detectedType = 'terramate-pro';
			serverArgs = [...args, "lsp"];
			console.log(`Using custom path for terramate-pro: ${customPath}`);
		} else if (customPath.includes('terramate-ls')) {
			detectedType = 'terramate-ls';
			console.log(`Using custom path for terramate-ls: ${customPath}`);
		} else {
			console.log(`Using custom language server: ${customPath}`);
		}
		
		return {
			name: detectedType === 'terramate-pro' ? "Terramate Pro Language Server" :
			      detectedType === 'terramate-ls' ? "Terramate Language Server (Open Source)" :
			      "Terramate Language Server (Custom)",
			path: customPath,
			args: serverArgs,
			type: detectedType
		};
	}

	// No custom path - search in PATH based on type
	// Handle explicit terramate-pro
	if (serverType === "terramate-pro") {
		const proPath = findBinary("terramate-pro");
		if (!proPath) {
			console.error("terramate-pro not found in PATH");
			window.showWarningMessage(
				'terramate-pro not found in PATH. Install it or set binPath in settings.',
				'Settings'
			).then(selection => {
				if (selection === 'Settings') {
					window.showInformationMessage('Set "terramate.languageServer.binPath" to the path of your terramate-pro binary.');
				}
			});
			return null;
		}
		return {
			name: "Terramate Pro Language Server",
			path: proPath,
			args: [...args, "lsp"],
			type: 'terramate-pro'
		};
	}

	// Handle explicit terramate-ls
	if (serverType === "terramate-ls") {
		const lsPath = findBinary("terramate-ls");
		if (!lsPath) {
			console.error("terramate-ls not found in PATH");
			window.showWarningMessage(
				'terramate-ls not found in PATH. Install it or set binPath in settings.',
				'Install Guide'
			).then(selection => {
				if (selection === 'Install Guide') {
					window.showInformationMessage('Visit https://terramate.io/docs/cli/installation for installation instructions.');
				}
			});
			return null;
		}
		return {
			name: "Terramate Language Server (Open Source)",
			path: lsPath,
			args: args,
			type: 'terramate-ls'
		};
	}

	// Auto-detect: try terramate-pro first, then terramate-ls
	if (serverType === "auto") {
		const proPath = findBinary("terramate-pro");
		if (proPath) {
			console.log("Auto-detected terramate-pro");
			return {
				name: "Terramate Pro Language Server",
				path: proPath,
				args: [...args, "lsp"],
				type: 'terramate-pro'
			};
		}

		const lsPath = findBinary("terramate-ls");
		if (lsPath) {
			console.log("Auto-detected terramate-ls");
			return {
				name: "Terramate Language Server (Open Source)",
				path: lsPath,
				args: args,
				type: 'terramate-ls'
			};
		}

		console.error("No language server found in PATH (tried terramate-pro and terramate-ls)");
		return null;
	}

	console.error(`Unknown language server type: ${serverType}`);
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
