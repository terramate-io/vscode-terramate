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

// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
	// Ignore patterns
	{
		ignores: [
			'**/node_modules/**',
			'**/out/**',
			'**/.vscode-test/**',
			'**/bin/**',
			'**/terramate/**'
		]
	},
	// Base configuration for all files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module'
			},
			globals: {
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			// ESLint recommended rules
			...eslint.configs.recommended.rules,
			
			// TypeScript ESLint recommended rules
			...tseslint.configs.recommended.rules,
			
			// Custom rules from original config
			'semi': [2, 'always'],
			'@typescript-eslint/no-unused-vars': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/explicit-module-boundary-types': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/no-require-imports': 0,
			
			// Additional overrides for compatibility
			'no-undef': 0, // TypeScript handles this
		}
	}
];

