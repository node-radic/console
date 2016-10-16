import {Config, PersistentConfig, IConfigProperty} from "@radic/util";
import {paths} from "./paths";
import {join} from "path";
import {readFileSync, existsSync} from "fs";
import * as dotenv from "dotenv";



let defaultConfig: any = {
    cli : {
        showCopyright: true
    },
    auth: {
        connections: []
    }
};

// The actual config
let _config = new PersistentConfig(defaultConfig, paths.userDataConfig);

// load .env stuff
var denvPath = join(paths.root, '.env');
if (existsSync(denvPath)) {
    var denv = dotenv.parse(readFileSync(denvPath));
    Object.keys(denv).forEach((key) => _config.set(key.toLowerCase().replace('_', '.'), denv[key]))
}

// export the wrapped config
let config: IConfigProperty = Config.makeProperty(_config);
export {config, IConfigProperty};
