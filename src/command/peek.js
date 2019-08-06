const fs = require('fs-extra');
const utils = require('../utils');
const readdir = require('readdir');
const chalk = require('chalk');

module.exports = function() {
    const resconfigFile = utils.readRootFile('/.catch-react-error-config.json');
    if (!resconfigFile) {
        return;
    }
    const filesArray = utils.readAllFilesRecurisve(
        `${process.cwd()}/${resconfigFile.sourceDir}`
    );
    if (!filesArray.length) {
        return 'no file has been transformed';
    }
    const transformFiles = filesArray.filter(item => {
        let fileContent = fs.readFileSync(item, 'utf8');
        if (fileContent) {
            const re = new RegExp(`${utils.CRE_Attr_Flag}`, 'g');
            if (re.test(fileContent)) return item;
        }
    });
    console.log(transformFiles);
};
