import * as cryptico from "cryptico";
import * as fs from "fs-extra";
import { kernel, injectable, inject } from "./kernel";
import { COMMANDO } from "./bindings";
import { paths } from "./paths";
import { dirname } from "path";
import { provideSingleton } from "../../src";

@provideSingleton(COMMANDO.KEYS)
export class Keys
{
    _secret: string
    _public: string


    constructor() {
        this._secret = cryptico.generateRSAKey('pass', 1024)
        this._public = fs.existsSync(paths.userPublicKeyFile) ? this.loadUserKeyFiles() : this.generateUserKeyFiles();
    }

    generateUserKeyFiles() {
        var key = cryptico.publicKeyString(this._secret);
        fs.ensureDirSync(dirname(paths.userPublicKeyFile));
        fs.writeFileSync(paths.userPublicKeyFile, key);
        return key;
    }

    loadUserKeyFiles() {
        return fs.readFileSync(paths.userPublicKeyFile, 'utf-8');
    }

    get secret(): string { return this._secret }

    get public(): string { return this._public }
}
