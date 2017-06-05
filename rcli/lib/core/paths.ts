import { join as j, resolve as r } from "path";
import { container } from "../../../src/core/Container";
let root = j(__dirname, '..', '..'),
    home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    cwd  = process.cwd()


export const paths: any = {
    root, home, cwd,
    bin              : j(root, 'bin'),
    src              : j(root, 'src'),
    packageFile      : j(root, 'package.json'),
    tsconfig         : j(root, 'tsconfig.json'),
    tsd              : j(root, 'tsd.json'),
    user             : home,
    userData         : j(home, '.r'),
    userCache: j(home, '.r', 'r.cache'),
    userDatabase     : j(home, '.r', 'r.db'),
    userDataConfig   : j(home, '.r', 'r.conf'),
    userSecretKeyFile: j(home, '.r', 'secret.key'),
    userPublicKeyFile: j(home, '.r', 'public.key'),
    backups          : j(home, '.r', 'backups'),
    dbBackups        : j(home, '.r', 'backups', 'db')
};
container.bind('paths').toConstantValue(paths);