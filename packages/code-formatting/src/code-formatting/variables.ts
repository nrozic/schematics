export const devDependencies: { [key: string]: string } = {
  husky: '@latest',
  prettier: '@latest',
  'prettier-stylelint': '@latest',
  'pretty-quick': '@latest',
  stylelint: '@latest',
  'stylelint-config-recommended': '@latest',
  tslint: '@latest',
  'tslint-config-prettier': '@latest',
  'stylelint-order': '@latest',
  'stylelint-prettier': '@latest',
  'tslint-eslint-rules': '@latest',
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
