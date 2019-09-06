'use strict';

function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
    );
}

function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function _iterableToArray(iter) {
    if (
        Symbol.iterator in Object(iter) ||
        Object.prototype.toString.call(iter) === '[object Arguments]'
    ) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
}

let chalk = require('chalk');

let fs = require('fs-extra');

let path = require('path');

let readdir = require('readdir'); // function compose

let compose = function compose() {
    for (
        var _len = arguments.length, fns = new Array(_len), _key = 0;
        _key < _len;
        _key++
    ) {
        fns[_key] = arguments[_key];
    }

    return function() {
        for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
        ) {
            args[_key2] = arguments[_key2];
        }

        return fns.reduceRight((res, fn) => {
            return [fn.call.apply(fn, [null].concat(_toConsumableArray(res)))];
        }, args)[0];
    };
}; // functor compose

let composeM = function composeM(chainMethod) {
    return function() {
        for (
            var _len3 = arguments.length, ms = new Array(_len3), _key3 = 0;
            _key3 < _len3;
            _key3++
        ) {
            ms[_key3] = arguments[_key3];
        }

        return ms.reduce((f, g) => {
            return function(x) {
                return g(x)[chainMethod](f);
            };
        });
    };
};

let composePromises = composeM('then');
let CRE_Attr_Flag = 'isCatchReactError';

let toChalk = function toChalk(color, info) {
    if (chalk[color]) {
        return chalk[color](info);
    }

    return chalk(info);
};

let log = compose(
    console.log,
    toChalk
);

function convertStrToReg(str) {
    try {
        let match = str.match(new RegExp('^/(.*?)/([gimy]*)$'));

        if (match) {
            let regex = new RegExp(match[1], match[2]);
            return regex;
        }
    } catch (error) {
        chalk.red(`${str} is an invalid stringify regexp`);
    }
}

function isReactComponent(file) {
    let re = /import\s*react/gi;
    return re.test(file);
}

function readAllFilesRecurisve(dir) {
    let dirPath = path.resolve(process.cwd(), dir);
    let filesArray = readdir.readSync(
        dirPath,
        ['**.js', '**.jsx'],
        readdir.ABSOLUTE_PATHS
    );
    return filesArray; // filesArray.map(startToParseReactFile);
}

function readRootFile(fileName) {
    let rootJsonFilfe = `${process.cwd()}/${fileName}`;
    let obj = fs.readJSONSync(rootJsonFilfe, {
        throws: false,
    });

    if (!obj) {
        log(
            'red',
            `\n ✖ failure : no such file ${rootJsonFilfe},please check your project`
        );
        log(
            'yellow',
            `\n ⚠️  prompt : ${chalk.bold.red(
                'run init command'
            )} can generate catch-react-error.json templates`
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
