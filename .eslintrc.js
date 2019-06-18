module.exports = {
    extends: ['@music/eslint-config-bass'].map(require.resolve),
    rules: {
        indent: ['warn', 4, { SwitchCase: 0 }],
        'no-script-url': 'off',
    },
};
