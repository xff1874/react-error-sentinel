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
let hasImport = false;

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
    const [pattern, flags] = resconfigFile.sentinel.filter;
    const filterReg = new RegExp(pattern, flags);
    if (!filterReg.test(file)) {
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

function isReactComponent(file) {
    const re = /import\s*react/gi;
    return re.test(file);
}

function transform(content, originFile) {
    const returnStatementVisitor = {
        ReturnStatement(path) {
            let oldJsx = path.node.argument;

            // 判断已经包裹的不要再次包裹
            if (
                oldJsx.type === 'JSXElement' &&
                oldJsx.openingElement.name.name ===
                    resconfigFile.sentinel.errorHandleComponent
            ) {
                return;
            }

            let openingElement = t.JSXOpeningElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent),
                []
            );
            let closingElement = t.JSXClosingElement(
                t.JSXIdentifier(resconfigFile.sentinel.errorHandleComponent)
            );
            let jsxChildren;
            if (oldJsx.type === 'ArrayExpression') {
                // return [<p>test1</p>, <h1>test2</h1>];
                jsxChildren = oldJsx.elements;
            } else if (oldJsx.type === 'StringLiteral') {
                // return 'sdasd';(也可以直接直接return,字符串毕竟不会报错)
                jsxChildren = [t.jsxText(oldJsx.value)];
            } else if (oldJsx.type === 'TemplateLiteral') {
                // return `sdasd ${new Date().getDay()}`;
                jsxChildren = [t.jsxExpressionContainer(oldJsx)];
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
            path.parent.body.push(newReturnStm);
        },
    };

    const classBodyVisitor = {
        ClassMethod(path) {
            const methodName = path.node.key.name;
            if (methodName === 'render') {
                path.traverse(returnStatementVisitor);
            }
        },
    };

    const convertVisitor = {
        Program: {
            enter() {
                hasImport = false;
            },

            exit(path, state) {
                if (!hasImport) {
                    resconfigFile.sentinel.imports.forEach(stm => {
                        const impstm = template.default.ast(stm);
                        path.node.body.unshift(impstm);
                    });
                }
            },
        },
        ImportDeclaration(path, state) {
            const findErrorHandleComponent = ({ local }) => local.name === resconfigFile.sentinel.errorHandleComponent;
            const importArr = path.node.specifiers.filter(
                findErrorHandleComponent
            );
            if (importArr.length > 0) {
                hasImport = true;
            }
        },
        'ClassDeclaration|ClassExpression': function(path, state) {
            if (!isReactComponentClass(t, path.node)) {
                return;
            }
            path.traverse(classBodyVisitor);
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

function isReactComponentClass(types, node) {
    const { superClass } = node;
    // class Btn extends Component
    const isComponent = types.isIdentifier(superClass, { name: 'Component' });
    // class Btn extends PureComponent
    const isPureComponent = types.isIdentifier(superClass, {
        name: 'PureComponent',
    });
    // class Btn extends React.xxx/成员变量
    const isMemberExpression = types.isMemberExpression(superClass);
    // class Btn extends React.Component
    const isReactDotComponent =
        types.isIdentifier(superClass.object, { name: 'React' }) &&
        types.isIdentifier(superClass.property, { name: 'Component' });
    // class Btn extends React.PureComponent
    const isReactDotPureComponent =
        types.isIdentifier(superClass.object, { name: 'React' }) &&
        types.isIdentifier(superClass.property, { name: 'PureComponent' });

    return (
        isComponent ||
        isPureComponent ||
        (isMemberExpression && (isReactDotComponent || isReactDotPureComponent))
    );
}
