const fs = require('fs-extra');
const utils = require('../utils');
const readdir = require('readdir');
// const path = require("path")

module.exports = function() {
    const resconfigFile = utils.readRootFile(
        'example/.catch-react-error-config.json'
    );
    const filesArray = utils.readAllFilesRecurisve(
        `${process.cwd()}/example/${resconfigFile.sourceDir}`
    );
    const transformFiles = filesArray.filter(item => {
        let fileContent = fs.readFileSync(item, 'utf8');
        if (fileContent) {
            const re = new RegExp(`${utils.CRE_Attr_Flag}`, 'g');
            if (re.test(fileContent)) return item;
        }
    });
    console.log(transformFiles);
};
