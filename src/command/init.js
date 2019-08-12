const co = require('co');
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const utils = require('../utils');

const tempFolder = path.resolve(__dirname, '../templates');

const userInput = () => inquirer.prompt([
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

const readTempCRErc = inputs => fs
    .readJson(`${tempFolder}/.catch-react-error-config.json`)
    .then(resrcObj => {
        resrcObj.mode = inputs.mode;
        resrcObj.sourceDir = inputs.sourceDir;
        return { inputs, resrcObj };
    });

const writeCRErc = ({ inputs, resrcObj }) => fs
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
    .catch(err => {
        utils.log(
            'red',
            '\n ✖ failure : generate config templates failure!'
        );
        utils.log('red', `\n ✖ error info :${err}`);
        process.exit();
    });

const copyCRErc = inputs => utils.composePromises(writeCRErc, readTempCRErc)(inputs);

const copyErrorComponent = inputs => fs
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
    .catch(err => {
        utils.log(
            'red',
            '\n ✖ failure : generate error boundary templates failure!'
        );
        utils.log('red', `\n ✖ error info :${err}`);
        process.exit();
    });

const processExit = () => {
    process.exit();
};

const init = () => {
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
