#!/usr/bin/env node

'use strict';

const packageJson = require('./package.json');
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const readdir = require('readdir');
let babel = require('@babel/core');

program.version(packageJson.version);
program
    .option('-m, --mode [mode]', 'csr or ssr', 'csr')
    .option('-d, --dir [dir]', 'where source code store', 'src')
    .option('-f, --force [force]', 'force update if already patched', true)
    .action(ops => {
        console.log(
            chalk.blue(
                `mode option is  ${ops.mode} ,dir option is ${ops.dir}, force option is ${ops.force}`
            )
        );
        if (checkProjectReactVersion()) {
            readAllFilesRecurisve(ops.dir);
        }
    });

program.on('--help', () => {
    console.log(
        chalk.green(`-----------description---------------
This cli will use getDerivedStateFromError() and componentDidCatch when you choose csr command
However, those react lifecycle functions doesn't support server sider rendering,So I will use try/catch to wrap the render function
As a result, If you don't know which command to use,just use the type ssr mode
    `)
    );
});

program.parse(process.argv);

function checkProjectReactVersion() {
    const rootPackageJson = path.resolve(__dirname, 'package.json');
    const obj = fs.readJSONSync(rootPackageJson, { throws: false });
    if (!obj) {
        console.log(
            chalk.red(
                `no such file ${rootPackageJson},please check your project`
            )
        );
        return false;
    }

    const reactVersion = obj.dependencies.react;
    if (!reactVersion) {
        console.log(chalk.red('no react package found in dependencies'));
        return false;
    }

    const cleanVersion = reactVersion.replace(/\^|~/, '');

    if (!semver.gte(cleanVersion, '16.0.0')) {
        console.log(
            chalk.red('your react version is lower than 16.0.0,please update')
        );
        return false;
    }
    console.log(chalk.blue('react version check finished'));
    return true;
}

function readAllFilesRecurisve(dir) {
    const dirPath = path.resolve(dir);
    let filesArray = readdir.readSync(
        dirPath,
        ['**.js', '**.jsx'],
        readdir.ABSOLUTE_PATHS
    );
    filesArray.map(item => {
        startToParseReactFile(item);
    });
    // console.log(filesArray);
}

function startToParseReactFile(file) {
    let fileContent = fs.readFileSync(file, 'utf8');
    // babel.transform
    if (isReactComponent(fileContent)) {
        transform(fileContent);
    } else {
        console.log(chalk.yellow(`${file} is not react component.`));
    }
}

function isReactComponent(file) {
    const re = /import\s*react/gi;
    return re.test(file);
}

function transform(content) {
    const MyVisitor = {
        visitor: {
            Identifier(path) {
                console.log(`Visiting: ${path.node.name}`);
            },
        },
    };
    const babelplugins = ['@babel/plugin-proposal-class-properties', MyVisitor];
    // eslint-disable-next-line max-len
    /** transform is more andvance than parse. transform include ast which parser only emit,source code ,file info and generator info */
    const re = babel.transformSync(content, {
        plugins: babelplugins,
        presets: ['@babel/preset-react'],
    });
    // console.log(re);
}
