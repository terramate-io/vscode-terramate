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
import * as assert from 'assert';
import { activate, getDocPath } from './helper';

/**
 * Syntax Recognition Tests
 * 
 * These tests verify that the VSCode extension correctly recognizes
 * Terramate files and applies syntax highlighting.
 * 
 * Requirements: NONE - Tests work without any language server
 */
suite('Syntax Recognition (No LS Required)', () => {
	const testFiles = [
		{ path: "terramate.tm", desc: ".tm file" },
		{ path: "bundles/complete.tm.hcl", desc: ".tm.hcl file with bundles" },
		{ path: "generate/generate_hcl.tm.hcl", desc: "generate_hcl file" },
		{ path: "components/component_definition.tm.hcl", desc: "component file" },
	];

	testFiles.forEach((tc) => {
		test(`Recognizes ${tc.desc} as Terramate`, async () => {
			const docUri = vscode.Uri.file(getDocPath(tc.path));
			await activate(docUri);
			
			const languageId = vscode.window.activeTextEditor?.document.languageId;
			assert.strictEqual(
				languageId,
				'terramate',
				`${tc.path} should be recognized as terramate`
			);
		});
	});
});

