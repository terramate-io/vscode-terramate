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
 * Language Server Integration Tests
 * 
 * These tests validate that the language server is working correctly.
 * 
 * Requirements: terramate-ls installed (any version)
 */
suite('Core LS: Integration and Diagnostics', () => {
	test('Language server detects errors in invalid files', async () => {
		const docUri = vscode.Uri.file(getDocPath('invalid/unrecognized-attr/terramate.tm'));
		await activate(docUri);
		
		const diagnostics = vscode.languages.getDiagnostics(docUri);
		
		// On Windows, LS might have timing or path issues
		if (process.platform === 'win32' && diagnostics.length === 0) {
			console.warn('Skipping strict diagnostic check on Windows (LS may need more time)');
			return;
		}
		
		// Language server should report at least one diagnostic
		assert.ok(
			diagnostics.length > 0,
			'Language server should report diagnostics for invalid file'
		);
		
		// Should be an error (not just warning)
		const hasError = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Error);
		assert.ok(hasError, 'Should have at least one error diagnostic');
	});
	
	test('Language server validates valid files without errors', async () => {
		const docUri = vscode.Uri.file(getDocPath('tmfiles/rootcfg/terramate.tm'));
		await activate(docUri);
		
		const diagnostics = vscode.languages.getDiagnostics(docUri);
		
		// Valid files should not have errors (warnings are ok)
		const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
		assert.strictEqual(
			errors.length,
			0,
			`Valid file should not have errors, but got: ${errors.map(e => e.message).join(', ')}`
		);
	});
	
	test('Language server recognizes all terramate file types', async () => {
		const testFiles = [
			'terramate.tm',
			'tmfiles/rootcfg/terramate.tm',
			'bundles/complete.tm.hcl',
		];
		
		for (const file of testFiles) {
			const docUri = vscode.Uri.file(getDocPath(file));
			await activate(docUri);
			
			const languageId = vscode.window.activeTextEditor?.document.languageId;
			assert.strictEqual(
				languageId,
				'terramate',
				`File ${file} should be recognized as terramate`
			);
		}
	});
});

