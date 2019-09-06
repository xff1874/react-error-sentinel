'use strict';

let path = require('path');

let fs = require('fs-extra');

let chalk = require('chalk');

let semver = require('semver');

let readdir = require('readdir');

let babel = require('@babel/core');

let template = require('@babel/template');

let traverse = require('@babel/traverse');

let generator = require('@babel/generator');

let prettier = require('prettier');

let t = require('@babel/types');

let htmlTags = require('html-tags');

let utils = require('../utils');

let resconfigFile;
let CRE_Attr_Flag = utils.CRE_Attr_Flag;

function checkProjectReactVersion() {
    let obj = utils.readRootFile('package.json');

    if (!obj) {
        utils.log(
            'red',
            '\n ✖ failure : can not find package.json,please check your project'
        );
        return;
    }

    let reactVersion = obj.dependencies.react;

    if (!reactVersion) {
        utils.log(
            'red',
            '\n ✖ failure : no react package found in dependencies'
        );
        return false;
    }

    let cleanVersion = reactVersion.replace(/\^|~/, '');

    if (!semver.gte(cleanVersion, '16.0.0')) {
        utils.log(
            'red',
            '\n ✖ failure : your react version is lower than 16.0.0,please update'
        );
        return false;
    }

    utils.log('green', '\n ✔ succcess : react version check finished');
    return true;
} // function readAllFilesRecurisve(dir) {
//     const dirPath = path.resolve(process.cwd(), dir);
//     const filesArray = readdir.readSync(
//         dirPath,
//         ['**.js', '**.jsx'],
//         readdir.ABSOLUTE_PATHS
//     );
//     filesArray.map(startToParseReactFile);
// }

function startToParseReactFile(file) {
    // 检索符合过滤条件的文件
    let filters = resconfigFile.sentinel.filter;
    let filtersReg = filters.map(utils.convertStrToReg);

    if (filters.length) {
        if (
            !filtersReg.some((reg) => {
                return reg.test(file);
            })
        ) {
            return;
        }
    }

    let fileContent = fs.readFileSync(file, 'utf8'); // babel.transform

    if (utils.isReactComponent(fileContent)) {
        transform(fileContent, file);
    } else {
        console.log(chalk.yellow(`${file} is not react component.`));
    }
}

function transform(content, originFile) {
    let customComponentVisitor = {
        JSXElement(path) {
            let tagName = path.node.openingElement.name.name;

            if (htmlTags.indexOf(tagName) >= 0) {
                return;
            }

            if (tagName === resconfigFile.sentinel.errorHandleComponent) {
                return;
            }

            if (path.parent.openingElement) {
                if (
                    path.parent.openingElement.name.name ===
                    resconfigFile.sentinel.errorHandleComponent
                ) {
                    return;
                }
            }

            let oldJsx = path.node;
            let isReactErrorSentinelAttr = t.jsxAttribute(
                t.jsxIdentifier(CRE_Attr_Flag)
            );
            let openingElement = t.JSXOpeningElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent),
                [isReactErrorSentinelAttr]
            );
            let closingElement = t.JSXClosingElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent)
            );
            let newJsx = t.JSXElement(openingElement, closingElement, [oldJsx]);
            path.replaceWith(newJsx);
        },
    };
    let convertVisitor = {
        Program: {
            exit(path) {
                let stm = resconfigFile.sentinel.imports;
                let impstm = template.default.ast(stm);
                t.addComment(impstm, 'leading', CRE_Attr_Flag, true);
                path.node.body.unshift(impstm);
            },
        },

        ImportDeclaration(path, state) {
            let _path$node$leadingCom = path.node.leadingComments;
            let leadingComments =
                    _path$node$leadingCom === void 0
                        ? []
                        : _path$node$leadingCom;
            let commentReg = new RegExp(CRE_Attr_Flag);

            let findErrorHandleComponent = function findErrorHandleComponent(
                comment
            ) {
                return (
                    comment.type === 'CommentLine' &&
                    commentReg.test(comment.value)
                );
            };

            let hasImport = leadingComments.some(findErrorHandleComponent);

            if (hasImport) {
                t.removeComments(path.node);
                path.remove();
            }
        },

        ReturnStatement(path) {
            if (resconfigFile.wrapAllCustomComponent) {
                path.traverse(customComponentVisitor);
            }

            let parentFunc = path.getFunctionParent();
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
                let oldJsxAttrs = oldJsx.openingElement.attributes;
                let isReactErrorSentinel = oldJsxAttrs.some((x) => {
                    return x.name && x.name.name === CRE_Attr_Flag;
                });

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
                t.jsxIdentifier(CRE_Attr_Flag)
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

            path.traverse(customComponentVisitor);
        },
    };
    let babelplugins = ['@babel/plugin-proposal-class-properties'];
    let ast = babel.parse(content, {
        plugins: babelplugins,
        presets: ['@babel/preset-react'],
    });
    traverse.default(ast, convertVisitor);
    let newCode = generator.default(ast).code;
    let prettifiedCode = prettier.format(newCode, {
        parser: 'babel',
    }); // return;

    if (newCode) {
        fs.outputFileSync(originFile, prettifiedCode, (err) => {
            if (err) throw new Error(`${originFile} write error: ${err}`);
        });
    }
}

module.exports = function() {
    resconfigFile = utils.readRootFile('.catch-react-error-config.json');

    if (!resconfigFile) {
        return;
    }

    if (checkProjectReactVersion()) {
        let filesArray = utils.readAllFilesRecurisve(resconfigFile.sourceDir);
        filesArray.map(startToParseReactFile);
    }
};
