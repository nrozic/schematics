export const devDependencies: { [key: string]: string } = {
    husky: '^4.2.5',
    prettier: '^1.19.1',
    'prettier-stylelint': '^0.4.2',
    'pretty-quick': '^2.0.1',
    stylelint: '^13.6.0',
    'stylelint-config-recommended': '^3.0.0',
    tslint: '^6.1.2',
    'tslint-config-prettier': '^1.18.0'
};

export const Husky: { [key: string]: Object } = {
    hooks: {
        'pre-commit':
            "pretty-quick --verbose --staged && prettier-stylelint --write -q 'src/**/*.{css,scss}'",
        'pre-push': 'ng lint',
        'post-merge': 'run-if-changed'
    }
};