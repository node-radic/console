import { Config, PersistentConfig, IConfigProperty } from "@radic/util";
import { paths } from "./paths";
import { join } from "path";
import { readFileSync, existsSync } from "fs";
import * as dotenv from "dotenv";


let defaultConfig: any = {
    debug: false,
    env: {},
    cli  : {
        showCopyright: true
    },
    auth : {
        connections: []
    }
};

// The actual config
let _config = new PersistentConfig(defaultConfig, paths.userDataConfig);

// load .env stuff
var denvPath = join(paths.root, '.env');
function parseEnvVal(val: any) {
    if ( val === 'true' || val === 'false' ) {
        return val === 'true'
    }
    if(isFinite(val)) return parseInt(val)
    return val
}
if ( existsSync(denvPath) ) {
    var denv = dotenv.parse(readFileSync(denvPath));
    Object.keys(denv).forEach((key:string) => {
        let value = parseEnvVal(denv[key])
        key = key.replace('_', '.');
        _config.set('env.'+ key, value)
        // only set if its actually a config key
        if(_config.has(key))
            _config.set(key, value)
    })
}

// export the wrapped config
let config: IConfigProperty = Config.makeProperty(_config);
export { config, IConfigProperty };
