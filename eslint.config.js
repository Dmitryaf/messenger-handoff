import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default tseslint.config(
  {
    ignores: ['.ai-rules/**', '.local/**', 'coverage/**', 'dist/**'],
  },
  {
    files: ['src/**/*.ts', 'frontend/**/*.ts', 'tests/**/*.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      curly: ['error', 'all'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../../*', '../../../*'],
              message: 'Use the @/* alias for cross-directory imports.',
            },
          ],
        },
      ],
    },
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['frontend/*/src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      curly: ['error', 'all'],
      'max-lines': [
        'error',
        { max: 140, skipBlankLines: true, skipComments: true },
      ],
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['frontend/**/*.ts', 'tests/frontend/**/*.ts'],
    rules: {
      'max-lines': [
        'error',
        { max: 140, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: [
      'src/modules/content-management/**/*.ts',
      'src/modules/operations-monitoring/**/*.ts',
    ],
    ignores: ['**/*.test.ts'],
    rules: {
      'max-lines': [
        'error',
        { max: 140, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ['frontend/shared/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@manage/**', '@ops/**'] },
      ],
    },
  },
  {
    files: ['frontend/manage/src/shared/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@manage/entities/**',
            '@manage/features/**',
            '@manage/widgets/**',
            '@manage/pages/**',
            '@manage/app/**',
          ],
        },
      ],
    },
  },
  {
    files: ['frontend/manage/src/entities/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@manage/features/**',
            '@manage/widgets/**',
            '@manage/pages/**',
            '@manage/app/**',
          ],
        },
      ],
    },
  },
  {
    files: ['frontend/manage/src/features/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@manage/widgets/**',
            '@manage/pages/**',
            '@manage/app/**',
          ],
        },
      ],
    },
  },
  {
    files: ['frontend/manage/src/widgets/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@manage/pages/**', '@manage/app/**'] },
      ],
    },
  },
  {
    files: ['frontend/manage/src/pages/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@manage/app/**'] }],
    },
  },
  {
    files: ['frontend/ops/src/entities/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@ops/features/**',
            '@ops/widgets/**',
            '@ops/pages/**',
            '@ops/app/**',
          ],
        },
      ],
    },
  },
  {
    files: ['frontend/ops/src/features/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@ops/widgets/**', '@ops/pages/**', '@ops/app/**'] },
      ],
    },
  },
  {
    files: ['frontend/ops/src/widgets/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@ops/pages/**', '@ops/app/**'] },
      ],
    },
  },
  {
    files: ['frontend/ops/src/pages/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@ops/app/**'] }],
    },
  },
  {
    files: ['src/modules/content-management/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/content-management/infrastructure/**',
            '@/modules/content-management/presentation/**',
            '@/modules/content-management/security/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/content-management/infrastructure/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/content-management/presentation/**',
            '@/modules/content-management/security/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/content-management/security/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/content-management/infrastructure/**',
            '@/modules/content-management/presentation/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/operations-monitoring/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/operations-monitoring/presentation/**',
            '@/modules/operations-monitoring/security/**',
          ],
        },
      ],
    },
  },
);
