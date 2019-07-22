#! /usr/bin/env node

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');

const fs = require('fs-extra');

const packageJSON = require('./package');
// const configTemplate = require('./templates/resrc-template.json');

program
    .version(packageJSON.version)
    .option('-l,--lan [type]', 'website langueage')
    .description(
        chalk.green(`-----------description---------------
This cli will use getDerivedStateFromError() and componentDidCatch when you choose csr command
However, those react lifecycle functions doesn't support server sider rendering,So I will use try/catch to wrap the render function
As a result, If you don't know which command to use,just use the type ssr mode
    `)
    );

program
    .command('init')
    .description('Generate a react-error-sentinel templates project')
    .alias('i')
    .action(() => {
        console.log(
            chalk.green(
                '\n √ succcess :start generate react-error-sentinel templates'
            )
        );
        co(function* () {
            let hasInputRenderMode = false;
            let renderMode;
            while (!hasInputRenderMode) {
                renderMode = yield prompt(
                    'select your project render mode (csr or ssr) ?'
                );
                if (renderMode !== 'csr' && renderMode !== 'ssr') {
                    console.log(
                        chalk.red(
                            '\n × failure : please select your project render mode!'
                        )
                    );
                } else {
                    hasInputRenderMode = true;
                }
            }

            fs.copy(
                `./templates/${renderMode}/resrc-template.json`,
                './.resrc-copy-test.json'
            )
                .then(() => {
                    console.log(
                        chalk.green('\n √ succcess :generate config templates')
                    );
                    process.exit();
                })
                .catch(err => {
                    console.log(
                        chalk.red(
                            '\n × failure : generate config templates failure!'
                        )
                    );
                    console.error(chalk.red(`\n × error info :${err}`));
                });
        });
    });

program.parse(process.argv);

if (program.lan == 'zh-cn') {
    console.log('Chinese website!');
}

if (program.lan == 'en') {
    console.log('English website!');
}
