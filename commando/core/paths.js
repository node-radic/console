"use strict";
const path_1 = require("path");
let root = path_1.join(__dirname, '..', '..'), home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, cwd = process.cwd();
exports.paths = {
    root, home, cwd,
    bin: path_1.join(root, 'bin'),
    src: path_1.join(root, 'src'),
    packageFile: path_1.join(root, 'package.json'),
    tsconfig: path_1.join(root, 'tsconfig.json'),
    tsd: path_1.join(root, 'tsd.json'),
    user: home,
    userData: path_1.join(home, '.r'),
    userCache: path_1.join(home, '.r', 'r.cache'),
    userDatabase: path_1.join(home, '.r', 'r.db'),
    userDataConfig: path_1.join(home, '.r', 'r.conf'),
    userSecretKeyFile: path_1.join(home, '.r', 'secret.key'),
    userPublicKeyFile: path_1.join(home, '.r', 'public.key'),
    backups: path_1.join(home, '.r', 'backups'),
    dbBackups: path_1.join(home, '.r', 'backups', 'db')
};
//# sourceMappingURL=paths.js.map