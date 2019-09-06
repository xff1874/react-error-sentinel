#! /usr/bin/env node

'use strict';

let program = require('commander');

let chalk = require('chalk');

let packageJSON = require('../package');

let init = require('./command/init');

let transform = require('./command/transform');

let peek = require('./command/peek');

program.version(packageJSON.version).description(
    chalk.green(`--------------description--------------
This cli will use getDerivedStateFromError() and componentDidCatch when you choose csr command
However, those react lifecycle functions doesn't support server sider rendering,So I will use try/catch to wrap the render function
As a result, If you don't know which command to use,just use the type ssr mode
    `)
);
program
    .command('init')
    .description('generate catch-react-error templates')
    .alias('i')
    .action(init);
program
    .command('transform')
    .description(
        'transform your source code wrapped with ErrorBoundary Component'
    )
    .alias('t')
    .action(transform);
program
    .command('peek')
    .description('look for all the transform files')
    .alias('p')
    .action(peek);
program.parse(process.argv);
