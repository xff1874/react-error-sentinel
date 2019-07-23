#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

const packageJSON = require('../package');
const init = require('./command/init');
const transform = require('./command/transform');

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

program.parse(process.argv);
