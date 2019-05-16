import { GenFilesOptions, genFiles } from '@huiji/shared-utils';

const optionsList: GenFilesOptions[] = [
  // components
  {
    comments: ['All components'],
    patterns: [
      'src/components/**/*.ts',
      'src/components/**/*.tsx',
      '!!src/components/base/**/*.ts',
    ],
    output: 'src/components/index.ts',
  },
  {
    comments: ['All components style'],
    patterns: ['src/components/**/*.scss', '!src/components/base/**/*.scss'],
    output: 'src/components/index.scss',
  },
  // views
  {
    comments: ['All views style'],
    patterns: ['src/views/**/*.scss'],
    output: 'src/views/index.scss',
  },
  // utils
  {
    comments: ['All utils'],
    patterns: ['src/utils/**/*.ts', '!src/utils/components.ts'],
    output: 'src/utils/index.ts',
  },
];

Promise.all(optionsList.map(genFiles)).catch((e: Error) => {
  /* eslint-disable no-console */
  console.error(e.message);
  console.error(e.stack);
});
