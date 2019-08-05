const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const readdir = require('readdir');

// function compose
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// functor compose
const composeM = chainMethod => (...ms) => ms.reduce((f, g) => x => g(x)[chainMethod](f));

const composePromises = composeM('then');

const CRE_Attr_Flag = 'isCatchReactError';

const toChalk = (color, info) => {
    if (chalk[color]) {
        return chalk[color](info);
    }
    return chalk(info);
};

const log = compose(
    console.log,
    toChalk
);

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

function isReactComponent(file) {
    const re = /import\s*react/gi;
    return re.test(file);
}

function readAllFilesRecurisve(dir) {
    const dirPath = path.resolve(process.cwd(), dir);
    const filesArray = readdir.readSync(
        dirPath,
        ['**.js', '**.jsx'],
        readdir.ABSOLUTE_PATHS
    );
    return filesArray;
    // filesArray.map(startToParseReactFile);
}

function readRootFile(fileName) {
    const rootJsonFilfe = `${process.cwd()}/${fileName}`;
    const obj = fs.readJSONSync(rootJsonFilfe, { throws: false });
    if (!obj) {
        log(
            'red',
            `\n ✖ failure : no such file ${rootJsonFilfe},please check your project`
        );
        log(
            'yellow',
            `\n ⚠️ prompt : ${chalk.bold.red(
                'run init command'
            )} can generate resrc.json templates`
        );
        return;
    }
    return obj;
}

module.exports = {
    log,
    composePromises,
    convertStrToReg,
    isReactComponent,
    readRootFile,
    readAllFilesRecurisve,
    CRE_Attr_Flag,
};
