const chalk = require('chalk');

// function compose
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// functor compose
const composeM = chainMethod => (...ms) => ms.reduce((f, g) => x => g(x)[chainMethod](f));

const composePromises = composeM('then');

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

module.exports = {
    log,
    composePromises,
    convertStrToReg,
    isReactComponent,
};
