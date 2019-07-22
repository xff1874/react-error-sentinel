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
const JSXAttrFlag = 'isReactErrorSentinel';
const commentContent = 'isReactErrorSentinel';

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
    filesArray.map(startToParseReactFile);
}

function isReactComponent(file) {
    const re = /import\s*react/gi;
    return re.test(file);
}

function startToParseReactFile(file) {
    // 检索符合过滤条件的文件
    const filters = resconfigFile.sentinel.filter;
    const filtersReg = filters.map(convertStrToReg);

    if (!filtersReg.some(reg => reg.test(file))) {
        return;
    }

    let fileContent = fs.readFileSync(file, 'utf8');
    // babel.transform
    if (isReactComponent(fileContent)) {
        transform(fileContent, file);
    } else {
        console.log(chalk.yellow(`${file} is not react component.`));
    }
}

function transform(content, originFile) {
    const convertVisitor = {
        Program: {
            exit(path) {
                resconfigFile.sentinel.imports.forEach(stm => {
                    const impstm = template.default.ast(stm);
                    t.addComment(impstm, 'leading', commentContent, true);
                    path.node.body.unshift(impstm);
                });
            },
        },
        ImportDeclaration(path, state) {
            const { leadingComments = [] } = path.node;
            const commentReg = new RegExp(commentContent);
            const findErrorHandleComponent = comment => comment.type === 'CommentLine' &&
                commentReg.test(comment.value);

            const hasImport = leadingComments.some(findErrorHandleComponent);
            if (hasImport) {
                t.removeComments(path.node);
                path.remove();
            }
        },
        ReturnStatement(path) {
            const parentFunc = path.getFunctionParent();
            if (!parentFunc.node.key || parentFunc.node.key.name !== 'render') {
                return;
            }

            let oldJsx = path.node.argument;
            if (!oldJsx) return;

            if (oldJsx.type === 'JSXElement') {
                const oldJsxAttrs = oldJsx.openingElement.attributes;
                const isReactErrorSentinel = oldJsxAttrs.some(
                    x => x.name && x.name.name === JSXAttrFlag
                );

                if (isReactErrorSentinel) {
                    oldJsx.openingElement.name = t.jsxIdentifier(
                        resconfigFile.sentinel.errorHandleComponent
                    );
                    oldJsx.closingElement.name = t.jsxIdentifier(
                        resconfigFile.sentinel.errorHandleComponent
                    );
                    return;
                }
            }

            let fallbackAttrExpression = t.jsxExpressionContainer(
                t.memberExpression(
                    t.identifier('this'),
                    t.identifier(resconfigFile.sentinel.fallbackFuncName)
                )
            );
            let fallbackAttr = t.jsxAttribute(
                t.jsxIdentifier('fallback'),
                fallbackAttrExpression
            );

            let isReactErrorSentinelAttr = t.jsxAttribute(
                t.jsxIdentifier(JSXAttrFlag)
            );

            let openingElement = t.JSXOpeningElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent),
                [isReactErrorSentinelAttr, fallbackAttr]
            );
            let closingElement = t.JSXClosingElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent)
            );
            let jsxChildren;
            if (oldJsx.type === 'ArrayExpression') {
                jsxChildren = oldJsx.elements;
            } else if (oldJsx.type === 'StringLiteral') {
                jsxChildren = [t.jsxText(oldJsx.value)];
            } else {
                jsxChildren = [t.jsxExpressionContainer(oldJsx)];
            }

            let newJsx = t.JSXElement(
                openingElement,
                closingElement,
                jsxChildren
            );
            let newReturnStm = t.returnStatement(newJsx);

            path.remove();
            if (path.parent.body) {
                path.parent.body.push(newReturnStm);
            }
        },
    };
    const babelplugins = [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
    ];
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

function convertStrToReg(str) {
    try {
        const match = str.match(new RegExp('^/(.*?)/([gimy]*)$'));
        if (match) {
            const regex = new RegExp(match[1], match[2]);
            return regex;
        }
    } catch (error) {
        chalk.red(`${str} is an invalid stringify regexp`);
    }
}
