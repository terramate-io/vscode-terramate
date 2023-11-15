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
			name: "invalid/multiple-tm-config-git/tm2.tm",
			diags: [new vscode.Diagnostic(
				range(begin(3, 12), end(3, 26)),
				'terramate schema error: attribute "default_branch" redeclared in file',
				vscode.DiagnosticSeverity.Error
			)]
		},
	];

	testcases.forEach((tc) => {
		const testFixture = getDocPath(tc.name);
		const file = vscode.Uri.file(testFixture);
		test('lint file: '+file, async () => {
			await testLint(file, tc.diags);
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
			map(filent => path.resolve(dir, filent.name)).
			sort();
		if (fileNames.length == 0) {
			return;
		}

		// we chose one file to report diagnostics but other files in the
		// directory will be also checked.
		const file = vscode.Uri.file(path.resolve(testDir, fileNames[0]));
		test('test file: '+file, async () => {
			await testLint(file, []);
		});
	});	
});


async function testLint(docUri: vscode.Uri, expected: vscode.Diagnostic[]) {
	await activate(docUri);
	assert.strictEqual(getActiveLanguageId(), "terramate");

	const actual = vscode.languages.getDiagnostics(docUri);
	assert.strictEqual(actual.length, expected.length);

	for(let i = 0; i < expected.length; i++) {
		assert.deepStrictEqual(actual[i].range, expected[i].range);
		if (!actual[i].message.includes(expected[i].message)) {
			assert.fail(`diagnostic message mismatch: want=${expected[i].message} but got=${actual[i].message}`);
		}
	}
}
