// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
	// 1) Expo 기본 설정
	expoConfig,

	// 2) 내 커스텀 설정
	{
		// 무시할 파일/폴더 (.eslintignore 대체)
		ignores: ['dist/**', 'build/**', 'node_modules/**'],

		// TypeScript 프로젝트 옵션
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},

		// 플러그인 설정
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
			prettier: require('eslint-plugin-prettier'),
		},

		rules: {
			// Prettier랑 안 맞으면 에러
			'prettier/prettier': ['error'],

			// 콘솔 허용
			'no-console': 'off',

			// RN에서 인라인 스타일은 일단 허용
			'react-native/no-inline-styles': 'off',

			// RN + TS 환경에서 import 관련 경고 완화
			'import/extensions': 'off',
			'import/no-unresolved': 'off',

			// JSX 확장자 허용 (.tsx, .jsx)
			'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],

			// TS 관련
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'error',
		},

		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true, // @types/* 도 같이 찾기
				},
			},
		},
	},
]);
