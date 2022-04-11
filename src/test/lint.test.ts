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

import * as vscode from 'vscode';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { activate, getActiveLanguageId, getDocPath, range, begin, end } from './helper';

suite('Should report diagnostics for the invalid fixtures', () => {
	const testcases = [
		{
			name: "invalid/unrecognized-attr/terramate.tm",
			diags: [new vscode.Diagnostic(
				range(begin(0, 0), end(0, 4)),
				'unrecognized attribute "attr"',
				vscode.DiagnosticSeverity.Error
			)]
		},
		{
			name: "invalid/multiple-tm-config-git/tm1.tm",
			diags: [new vscode.Diagnostic(
				range(begin(2, 8), end(2, 13)),
				'multiple terramate.config.git blocks',
				vscode.DiagnosticSeverity.Error
			)]
		},
	];

	testcases.forEach((tc) => {
		const testFixture = getDocPath(tc.name);
		test('lint file: '+testFixture, async () => {
			await testLint(vscode.Uri.file(testFixture), tc.diags);
		});
	});
});

suite('Should not report diagnostics for the valid files', () => {
	const testDir = getDocPath("tmfiles");
	const dirents = fs.readdirSync(testDir, {withFileTypes: true});
	const dirNames = dirents.
		filter(dirent => dirent.isDirectory()).
		map(dirent => path.resolve(testDir, dirent.name));

	dirNames.forEach((dir) => {
		const filents = fs.readdirSync(dir, {withFileTypes: true});
		const fileNames = filents.
		filter(filent => filent.isFile()).
		map(filent => path.resolve(dir, filent.name));
		if (fileNames.length == 0) {
			return;
		}

		// we chose one file to report diagnostics but other files in the
		// directory will be also checked.
		const file = fileNames[0]; 

		test('test file: '+file, async () => {
			await testLint(vscode.Uri.file(path.resolve(testDir, file)), []);
		});
	});	
});


async function testLint(docUri: vscode.Uri, expectedDiagnostic: vscode.Diagnostic[]) {
	await activate(docUri);
	assert.strictEqual(getActiveLanguageId(), "terramate");

	const actualDiagnostics = vscode.languages.getDiagnostics(docUri);
	assert.strictEqual(actualDiagnostics.length, expectedDiagnostic.length);

	for(let i = 0; i < expectedDiagnostic.length; i++) {
		assert.deepStrictEqual(actualDiagnostics[i].range, expectedDiagnostic[i].range);
		if (!actualDiagnostics[i].message.includes(expectedDiagnostic[i].message)) {
			assert.fail(`diagnostic message mismatch: want=${expectedDiagnostic[i].message} but got=${actualDiagnostics[i].message}`);
		}
	}
}
