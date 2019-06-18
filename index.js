#!/usr/bin/env node
'use strict';

const packageJson = require('./package.json');
const program = require('commander');
const chalk = require("chalk");
const shell = require('shelljs');



program.version(packageJson.version);
program
    .command('init')
    .alias("i")
    .description('init .rescliconfig file')
    .action(function() {
        const filePath = '.rescliconfig';
        shell.touch(filePath);
        console.log(chalk.green(`${filePath} created`))
    });

program
    .command('pcsr [isforceupdate]')
    .alias("c")
    .description('patch code to react component')
    .action(function(options){
        console.log(chalk.green(`start to handler pcsr command and the isforceupdate is ${options}`))
     })

program
    .command('pssr [isforceupdate]')
    .alias("s")
    .description('patch code to react component')
    .action(function(options){
        console.log(options)
    })

program.on("--help",function(){
    console.log(` -----------description---------------
This cli will use getDerivedStateFromError() and componentDidCatch when you input pcsr command
As those react lifecycle functions doesn't support server sider rendering, I will use try/catch to wrap the render function
So, If you don't know which command to use,just use the type pssr
    `)
})

program.parse(process.argv);
