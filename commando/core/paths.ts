import { join as j, resolve as r } from "path";
let root = j(__dirname, '..', '..'),
    home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    cwd  = process.cwd()


export var paths: any = {
    root, home, cwd,
    bin              : j(root, 'bin'),
    src              : j(root, 'src'),
    packageFile      : j(root, 'package.json'),
    tsconfig         : j(root, 'tsconfig.json'),
    tsd              : j(root, 'tsd.json'),
    user             : home,
    userData         : j(home, '.r'),
    userDatabase     : j(home, '.r', 'r.db'),
    userDataConfig   : j(home, '.r', 'r.conf'),
    userSecretKeyFile: j(home, '.r', 'secret.key'),
    userPublicKeyFile: j(home, '.r', 'public.key'),
    backups          : j(home, '.r', 'backups'),
    dbBackups        : j(home, '.r', 'backups', 'db')
};


