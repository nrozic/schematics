export const devDependencies: { [key: string]: string } = {
  husky: '*',
  prettier: '*',
  'prettier-stylelint': '*',
  'pretty-quick': '*',
  stylelint: '*',
  'stylelint-config-recommended': '*',
  tslint: '*',
  'tslint-config-prettier': '*',
  'stylelint-order': '*',
  'stylelint-prettier': '*',
  'tslint-eslint-rules': '*',
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
  'allow-leading-underscore',
];
