#!/usr/bin/env node
'use strict';

const packageJson = require('./package.json');
const program = require('commander');
const chalk = require("chalk");
const shell = require('shelljs');



program.version(packageJson.version);
program.option('-m, --mode [mode]', 'csr or ssr','csr')
  .option('-d, --dir [dir]', 'where source code store',"src")
  .option('-f, --force [force]', 'force update if already patched',true)
  .action(function(ops){
      console.log(chalk.blue(`mode option is  ${ops.mode} ,dir option is ${ops.dir}, force option is ${ops.force}`))
  })




program.on("--help",function(){
    console.log(chalk.green(`-----------description---------------
This cli will use getDerivedStateFromError() and componentDidCatch when you choose csr command
However, those react lifecycle functions doesn't support server sider rendering,So I will use try/catch to wrap the render function
As a result, If you don't know which command to use,just use the type ssr mode
    `))
})

program.parse(process.argv);
