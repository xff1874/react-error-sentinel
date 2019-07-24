const path = require('path');

const resolveApp = p => path.resolve(process.cwd(), p);

module.exports = {
    src: resolveApp('dev/src'),
    build: resolveApp('dev/build'),
    appDll: resolveApp('dev/build/dll'),
    boundary: resolveApp('dev/src/boundary'),
};
