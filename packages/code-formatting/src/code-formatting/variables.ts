export const devDependencies: { [key: string]: string } = {
  husky: '^4.2.5',
  prettier: '^1.19.1',
  'prettier-stylelint': '^0.4.2',
  'pretty-quick': '^2.0.1',
  stylelint: '^13.6.0',
  'stylelint-config-recommended': '^3.0.0',
  tslint: '^6.1.2',
  'tslint-config-prettier': '^1.18.0',
  'stylelint-order': '^4.1.0',
  'stylelint-prettier': '^1.1.2',
};

export const Husky: { [key: string]: object } = {
  hooks: {
    'pre-commit':
      "pretty-quick --verbose --staged && prettier-stylelint --write -q 'src/**/*.{css,scss}'",
    'pre-push': 'ng lint',
    'post-merge': 'run-if-changed',
  },
};

export const paths = {
  'core-js/es7/reflect': ['node_modules/core-js/proposals/reflect-metadata'],
  'core-js/es6/*': ['node_modules/core-js/es/*'],
  '@assets/*': ['src/assets/*'],
  '@env/*': ['src/environments/*'],
  '@app/*': ['src/app/*'],
  '@src/*': ['src/*'],
  '@e2e/*': ['e2e/*'],
};

export const tsconfigVariableNameOptions = [
  'ban-keywords',
  'check-format',
  'allow-pascal-case',
  'allow-snake-case',
  'allow-snake-case',
];
