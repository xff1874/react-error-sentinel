'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const vendorManifest = require('../build/dll/vendor.manifest.json');

const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    mode: 'development',
    output: {
        path: paths.build,
        filename: 'client.js',
    },
    entry: {
        app: path.resolve(paths.src, 'client/index.js'),
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: ['node_modules', paths.src],
        alias: {
            $component: path.resolve(__dirname, '../src/boundary'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: paths.src,
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ['react-app'],
                    plugins: [
                        // ['react-error-sentinel', {
                        //     // global errorHandler
                        //     errorHandler: '../utils/SSRErrorHandler.js',
                        // }]
                        // ["wyimport", {libraryName:"lodash"}]
                    ],
                    compact: true,
                    cacheDirectory: false,
                },
            },
        ],
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: vendorManifest,
        }),
    ],
};
