import globals from 'globals';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	}
);
