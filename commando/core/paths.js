"use strict";
var path_1 = require("path");
var root = path_1.join(__dirname, '..', '..'), home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, cwd = process.cwd();
exports.paths = {
    root: root, home: home, cwd: cwd,
    bin: path_1.join(root, 'bin'),
    src: path_1.join(root, 'src'),
    packageFile: path_1.join(root, 'package.json'),
    tsconfig: path_1.join(root, 'tsconfig.json'),
    tsd: path_1.join(root, 'tsd.json'),
    user: home,
    userData: path_1.join(home, '.r'),
    userDatabase: path_1.join(home, '.r', 'r.db'),
    userDataConfig: path_1.join(home, '.r', 'r.conf'),
    userSecretKeyFile: path_1.join(home, '.r', 'secret.key'),
    userPublicKeyFile: path_1.join(home, '.r', 'public.key'),
};
//# sourceMappingURL=paths.js.map