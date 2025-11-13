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
 * Bundle and Component Tests (Pro LS Features)
 * 
 * These tests validate bundle and component syntax recognition.
 * 
 * NOTE: These tests are LENIENT - they only verify syntax is recognized,
 * not that the language server validates bundles/components.
 * For full validation, you need terramate-ls built with Pro features.
 * 
 * Requirements: None (tests syntax highlighting only)
 * Optional: terramate-ls with Pro features for full validation
 */
suite('Pro Features: Bundle and Component Syntax', () => {
	// These tests verify the VSCode extension recognizes bundle/component syntax
	// Actual semantic validation depends on your terramate-ls build
	
	const bundleTestcases = [
		{
			name: "bundles/metadata.tm.hcl",
			description: "bundle metadata definition"
		},
		{
			name: "bundles/complete.tm.hcl",
			description: "complete bundle with inputs and exports"
		},
		{
			name: "bundles/stack_component.tm.hcl",
			description: "bundle stack with components"
		},
	];

	bundleTestcases.forEach((tc) => {
		const testFixture = getDocPath(tc.name);
		const file = vscode.Uri.file(testFixture);
		test(`bundle syntax: ${tc.description}`, async () => {
			await testBundleSyntax(file);
		});
	});

	const componentTestcases = [
		{
			name: "components/component_definition.tm.hcl",
			description: "component definition with inputs"
		},
		{
			name: "components/component_instantiation.tm.hcl",
			description: "component instantiation patterns"
		},
	];

	componentTestcases.forEach((tc) => {
		const testFixture = getDocPath(tc.name);
		const file = vscode.Uri.file(testFixture);
		test(`component syntax: ${tc.description}`, async () => {
			await testComponentSyntax(file);
		});
	});
});

async function testBundleSyntax(docUri: vscode.Uri) {
	await activate(docUri);
	
	// Verify file is recognized as Terramate
	const languageId = vscode.window.activeTextEditor?.document.languageId;
	assert.strictEqual(languageId, "terramate", "File should be recognized as terramate");
	
	const diagnostics = vscode.languages.getDiagnostics(docUri);
	
	// STRICT: Check that language server recognizes bundle blocks
	// If LS doesn't support bundles, it will report "unrecognized block" errors
	const unrecognizedBundleErrors = diagnostics.filter(d => 
		(d.message.includes("unrecognized block") && d.message.includes("define")) ||
		(d.message.includes("unrecognized block") && d.message.includes("bundle"))
	);
	
	assert.strictEqual(
		unrecognizedBundleErrors.length,
		0,
		`Bundle blocks should be recognized by language server. ` +
		`Got errors: ${unrecognizedBundleErrors.map(d => d.message).join('; ')}. ` +
		`This requires terramate-ls built with Pro features.`
	);
}

async function testComponentSyntax(docUri: vscode.Uri) {
	await activate(docUri);
	
	// Verify file is recognized as Terramate
	const languageId = vscode.window.activeTextEditor?.document.languageId;
	assert.strictEqual(languageId, "terramate", "File should be recognized as terramate");
	
	const diagnostics = vscode.languages.getDiagnostics(docUri);
	
	// STRICT: Check that language server recognizes component blocks
	const unrecognizedComponentErrors = diagnostics.filter(d => 
		(d.message.includes("unrecognized block") && d.message.includes("define")) ||
		(d.message.includes("unrecognized block") && d.message.includes("component"))
	);
	
	assert.strictEqual(
		unrecognizedComponentErrors.length,
		0,
		`Component blocks should be recognized by language server. ` +
		`Got errors: ${unrecognizedComponentErrors.map(d => d.message).join('; ')}. ` +
		`This requires terramate-ls built with Pro features.`
	);
}

