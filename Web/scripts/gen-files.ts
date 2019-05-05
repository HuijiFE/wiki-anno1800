import { GenFilesOptions, genFiles } from '@huiji/shared-utils';

const optionsList: GenFilesOptions[] = [
  // components
  {
    comments: ['All components'],
    patterns: ['src/components/**/*.ts', 'src/components/**/*.tsx'],
    output: 'src/components/all.ts',
  },
  {
    comments: ['All components style'],
    patterns: ['src/components/**/*.scss', '!src/components/base/**/*.scss'],
    output: 'src/components/all.scss',
  },
  // views
  {
    comments: ['All views style'],
    patterns: ['src/views/**/*.scss'],
    output: 'src/views/all.scss',
  },
];

Promise.all(optionsList.map(genFiles)).catch((e: Error) => {
  /* eslint-disable no-console */
  console.error(e.message);
  console.error(e.stack);
});
