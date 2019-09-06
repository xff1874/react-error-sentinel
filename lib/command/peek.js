'use strict';

let fs = require('fs-extra');

let utils = require('../utils');

module.exports = function() {
    let resconfigFile = utils.readRootFile('/.catch-react-error-config.json');

    if (!resconfigFile) {
        return;
    }

    let filesArray = utils.readAllFilesRecurisve(
        `${process.cwd()}/${resconfigFile.sourceDir}`
    );

    if (!filesArray.length) {
        return 'no file has been transformed';
    }

    let transformFiles = filesArray
        .filter((item) => {
            let fileContent = fs.readFileSync(item, 'utf8');

            if (fileContent) {
                let re = new RegExp(`${utils.CRE_Attr_Flag}`, 'g');

                if (re.test(fileContent)) {
                    return item;
                }
            }
        })
        .map((x) => {
            return x.replace(process.cwd(), '');
        });
    return transformFiles;
};
