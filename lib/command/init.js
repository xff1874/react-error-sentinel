'use strict';

let co = require('co');

let path = require('path');

let inquirer = require('inquirer');

let fs = require('fs-extra');

let utils = require('../utils');

let tempFolder = path.resolve(__dirname, '../templates');

let userInput = function userInput() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'What is your project render mode?',
            choices: ['csr (client side render)', 'ssr (server side render)'],
            default: 'ssr (server side render)',

            filter(val) {
                return val.substring(0, 3);
            },
        },
        {
            type: 'input',
            name: 'sourceDir',
            message:
                'Please input your source directory (relative path to root).',

            default() {
                return 'src';
            },
        },
        {
            type: 'input',
            name: 'componentFolder',
            message:
                'Please input the folder name where you want to save the template ErrorBoundary Component',

            default() {
                return 'catch-react-error-component';
            },
        },
    ]);
};

let readTempCRErc = function readTempCRErc(inputs) {
    return fs
        .readJson(`${tempFolder}/.catch-react-error-config.json`)
        .then((resrcObj) => {
            resrcObj.mode = inputs.mode;
            resrcObj.sourceDir = inputs.sourceDir;
            return {
                inputs,
                resrcObj,
            };
        });
};

let writeCRErc = function writeCRErc(_ref) {
    let inputs = _ref.inputs;
    let resrcObj = _ref.resrcObj;
    return fs
        .writeJson(
            `${process.cwd()}/.catch-react-error-config.json`,
            resrcObj,
            {
                spaces: 4,
            }
        )
        .then(() => {
            utils.log('green', '\n ✔ succcess : generate config templates end');
            return inputs;
        })
        .catch((err) => {
            utils.log(
                'red',
                '\n ✖ failure : generate config templates failure!'
            );
            utils.log('red', `\n ✖ error info :${err}`);
            process.exit();
        });
};

let copyCRErc = function copyCRErc(inputs) {
    return utils.composePromises(writeCRErc, readTempCRErc)(inputs);
};

let copyErrorComponent = function copyErrorComponent(inputs) {
    return fs
        .copy(
            `${tempFolder}/${inputs.mode}/ErrorBoundary.js`,
            `${process.cwd()}/${inputs.componentFolder}/ErrorBoundary.js`
        )
        .then(() => {
            utils.log(
                'green',
                '\n ✔ succcess : generate error boundary templates end'
            );
            return inputs;
        })
        .catch((err) => {
            utils.log(
                'red',
                '\n ✖ failure : generate error boundary templates failure!'
            );
            utils.log('red', `\n ✖ error info :${err}`);
            process.exit();
        });
};

let processExit = function processExit() {
    process.exit();
};

let init = function init() {
    utils.log('green', '\n start init catch-react-error templates');
    utils.composePromises(
        processExit,
        copyErrorComponent,
        copyCRErc,
        userInput
    )();
};

module.exports = {
    init,
    userInput,
    copyCRErc,
    readTempCRErc,
    writeCRErc,
    copyErrorComponent,
    processExit,
};
