#!/usr/bin/env node

'use strict';

const packageJson = require('./package.json');
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const readdir = require('readdir');
const babel = require('@babel/core');
const template = require('@babel/template');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const prettier = require('prettier');
const t = require('@babel/types');

let resconfigFile;

program.version(packageJson.version);
program.option('-p, --patch', 'start to run the cli').action(() => {
    resconfigFile = readRootFile('.resrc.json');
    if (!resconfigFile) {
        return;
    }
    // console.log(resconfigFile);

    if (checkProjectReactVersion()) {
        readAllFilesRecurisve(resconfigFile.sourceDir);
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

function readRootFile(fileName) {
    const rootJsonFilfe = path.resolve(__dirname, fileName);
    const obj = fs.readJSONSync(rootJsonFilfe, { throws: false });
    if (!obj) {
        console.log(
            chalk.red(`no such file ${rootJsonFilfe},please check your project`)
        );
        return;
    }
    return obj;
}

function checkProjectReactVersion() {
    const obj = readRootFile('package.json');
    if (!obj) {
        return;
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
        transform(fileContent, file);
    } else {
        console.log(chalk.yellow(`${file} is not react component.`));
    }
}

function isReactComponent(file) {
    const re = /import\s*react/gi;
    return re.test(file);
}

function transform(content, originFile) {
    const convertVisitor = {
        ClassMethod(path) {
            // if(path.node.key.name =="render"){
            //     let returnStmNode = path.node.body.body[0];
            //     let returnStm = path.get("ReturnStatement");
            //     if(returnStm){
            //         let oldJsx = returnStmNode.argument;
            //         let openingElement =  t.JSXOpeningElement(t.JSXIdentifier('DashboardItem'),[]);
            //         let closingElement =  t.JSXClosingElement(t.JSXIdentifier('DashboardItem'));
            //         let jsxChildren = [oldJsx];
            //         let newJsx=  t.JSXElement(openingElement, closingElement, jsxChildren)
            //         let newReturnStm = t.returnStatement(newJsx)
            //         path.get("body").pushContainer("body",newReturnStm);
            //     }
            // }
        },
        ReturnStatement(path) {
            const id = path.scope.generateUidIdentifierBasedOnNode(
                path.node.id
            );

            let oldJsx = path.node.argument;
            let openingElement = t.JSXOpeningElement(
                t.JSXIdentifier('DashboardItem'),
                []
            );
            let closingElement = t.JSXClosingElement(
                t.JSXIdentifier('DashboardItem')
            );
            let jsxChildren = [oldJsx];
            let newJsx = t.JSXElement(
                openingElement,
                closingElement,
                jsxChildren
            );
            let newReturnStm = t.returnStatement(newJsx);

            path.remove();
            path.parent.body.push(newReturnStm);
        },
    };
    const babelplugins = ['@babel/plugin-proposal-class-properties'];
    const ast = babel.parse(content, {
        plugins: babelplugins,
        presets: ['@babel/preset-react'],
    });

    traverse.default(ast, convertVisitor);

    let newCode = generator.default(ast).code;

    const prettifiedCode = prettier.format(newCode, { parser: 'babel' });
    // return;
    if (newCode) {
        fs.writeFile(originFile, prettifiedCode, err => {
            if (err) throw new Error(`${originFile} write error: ${err}`);
        });
    }
}
