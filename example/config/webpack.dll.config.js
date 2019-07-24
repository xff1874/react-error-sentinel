// const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');

const dllConfig = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom'],
    },
    output: {
        filename: '[name].dll.js',
        path: paths.appDll,
        library: '_dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            name: '_dll_[name]',
            path: `${paths.appDll}/[name].manifest.json`,
        }),
    ],
};

module.exports = dllConfig;
