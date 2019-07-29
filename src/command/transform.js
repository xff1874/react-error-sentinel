const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const chalk = require('chalk');
const semver = require('semver');
const readdir = require('readdir');
const babel = require('@babel/core');
const template = require('@babel/template');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const prettier = require('prettier');
const t = require('@babel/types');

const utils = require('../utils');

let resconfigFile;
const RES_Attr_Flag = 'isReactErrorSentinel';

function readRootFile(fileName) {
    const rootJsonFilfe = `${process.cwd()}/${fileName}`;
    const obj = fs.readJSONSync(rootJsonFilfe, { throws: false });
    if (!obj) {
        utils.log(
            'red',
            `\n ✖ failure : no such file ${rootJsonFilfe},please check your project`
        );
        utils.log(
            'yellow',
            `\n ⚠️ prompt : ${chalk.bold.red(
                'run init command'
            )} can generate resrc.json templates`
        );
        return;
    }
    return obj;
}

function checkProjectReactVersion() {
    const obj = readRootFile('package.json');
    if (!obj) {
        utils.log(
            'red',
            '\n ✖ failure : can not find package.json,please check your project'
        );
        return;
    }

    const reactVersion = obj.dependencies.react;
    if (!reactVersion) {
        utils.log(
            'red',
            '\n ✖ failure : no react package found in dependencies'
        );
        return false;
    }

    const cleanVersion = reactVersion.replace(/\^|~/, '');

    if (!semver.gte(cleanVersion, '16.0.0')) {
        utils.log(
            'red',
            '\n ✖ failure : your react version is lower than 16.0.0,please update'
        );
        return false;
    }
    utils.log('green', '\n ✔ succcess : react version check finished');
    return true;
}

function readAllFilesRecurisve(dir) {
    const dirPath = path.resolve(process.cwd(), dir);
    const filesArray = readdir.readSync(
        dirPath,
        ['**.js', '**.jsx'],
        readdir.ABSOLUTE_PATHS
    );
    filesArray.map(startToParseReactFile);
}

function startToParseReactFile(file) {
    // 检索符合过滤条件的文件
    const filters = resconfigFile.sentinel.filter;
    const filtersReg = filters.map(utils.convertStrToReg);
    if (!filtersReg.some(reg => reg.test(file))) {
        return;
    }

    let fileContent = fs.readFileSync(file, 'utf8');
    // babel.transform
    if (utils.isReactComponent(fileContent)) {
        transform(fileContent, file);
    } else {
        console.log(chalk.yellow(`${file} is not react component.`));
    }
}

function transform(content, originFile) {
    const convertVisitor = {
        Program: {
            exit(path) {
                const stm = resconfigFile.sentinel.imports;
                const impstm = template.default.ast(stm);
                t.addComment(impstm, 'leading', RES_Attr_Flag, true);
                path.node.body.unshift(impstm);
            },
        },
        ImportDeclaration(path, state) {
            const { leadingComments = [] } = path.node;
            const commentReg = new RegExp(RES_Attr_Flag);
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
            let oldJsx = path.node.argument;
            if (!oldJsx) return;
            if (
                (!parentFunc.node.key ||
                    parentFunc.node.key.name !== 'render') &&
                oldJsx.type !== 'JSXElement'
            ) {
                return;
            }

            if (oldJsx.type === 'JSXElement') {
                const oldJsxAttrs = oldJsx.openingElement.attributes;
                const isReactErrorSentinel = oldJsxAttrs.some(
                    x => x.name && x.name.name === RES_Attr_Flag
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

            let isReactErrorSentinelAttr = t.jsxAttribute(
                t.jsxIdentifier(RES_Attr_Flag)
            );

            let openingElement = t.JSXOpeningElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent),
                [isReactErrorSentinelAttr]
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

module.exports = function() {
    resconfigFile = readRootFile('.catch-react-error-config.json');
    if (!resconfigFile) {
        return;
    }

    if (checkProjectReactVersion()) {
        readAllFilesRecurisve(resconfigFile.sourceDir);
    }
};
