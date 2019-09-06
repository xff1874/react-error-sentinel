var fs = require('fs-extra');

var originFolder = process.cwd() + '/src/templates';
var targetFolder = process.cwd() + '/lib/templates';

fs.copySync(originFolder, targetFolder);
