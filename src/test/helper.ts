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

import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/**
 * Activates the vscode.terramate extension
 */
export async function activate(docUri: vscode.Uri) {
	// The extensionId is `publisher.name` from package.json
	const ext = vscode.extensions.getExtension('terramate.terramate');
	if (ext === undefined) {
		throw new Error("extension not found: check the publisher.name in the package.json");
	}

	await ext.activate();
	try {
		doc = await vscode.workspace.openTextDocument(docUri);
		editor = await vscode.window.showTextDocument(doc);
		
		// Wait longer for language server to start and process the file
		// Language server needs time to:
		// 1. Start (can take 1-2 seconds)
		// 2. Initialize
		// 3. Parse the file
		// 4. Run diagnostics
		await sleep(4000); // Increased from 2000ms to 4000ms
	} catch (e) {
		console.error(e);
	}
}

async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const getFixturePath = () => {
	return path.resolve(__dirname, '../../testFixture');
};

export const getDocPath = (p: string) => {
	return path.resolve(getFixturePath(), p);
};
export const getDocUri = (p: string) => {
	return vscode.Uri.file(getDocPath(p));
};

export function getActiveLanguageId(): string {
	return vscode.window.activeTextEditor.document.languageId;
}

function begin(line: number, char: number): vscode.Position {
	return new vscode.Position(line, char);
}

function range(start :vscode.Position, end :vscode.Position) :vscode.Range {
	return new vscode.Range(start, end);
}

export { 
	begin,
	begin as end,
	range
};


