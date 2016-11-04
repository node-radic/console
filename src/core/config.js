"use strict";
const util = require("@radic/util");
let defaults = {
    app: {
        title: undefined,
        description: undefined,
        version: undefined,
    },
    styles: {
        title: 'yellow bold',
        subtitle: 'yellow',
        success: 'green lighten 20 bold',
        header: 'darkorange bold',
        group: 'steelblue bold',
        command: 'darkcyan',
        description: 'darkslategray',
        argument: 'yellow darken 25'
    },
    colors: {
        enabled: true,
        title: 'yellow bold',
        subtitle: 'yellow',
        success: 'green lighten 20 bold',
        header: 'darkorange bold',
        group: 'steelblue bold',
        command: 'slateblue',
        description: 'darkslategray',
        argument: 'yellow darken 25'
    },
    help: {
        enabled: false,
        key: undefined,
        command: undefined
    },
    descriptor: {
        cli: {
            showTitle: true,
            showVersion: true,
            showDescription: true,
            showHelpAsDefault: true
        },
        group: {
            showHelpAsDefault: true
        },
        command: {
            showHelpAsDefault: false
        },
        text: {
            commands: 'Commands & Groups',
            options: 'Options',
            arguments: 'Arguments',
            globalOptions: 'Global Options',
            usage: 'Usage',
            example: 'Example'
        }
    }
};
class Config extends util.Config {
    title(title) {
        this.set('app.title', title);
        return this;
    }
    version(title) {
        this.set('app.version', title);
        return this;
    }
    description(title) {
        this.set('app.description', title);
        return this;
    }
    help(key, command) {
        this.merge('help', {
            enabled: true,
            key: key,
            command: command
        });
        return this;
    }
    dump() {
        console.dir(this.data, { colors: true, showHidden: true });
    }
    get(prop, def) {
        return super.get(prop, def);
    }
    static makeProperty(config) {
        var cf = function (prop) {
            return config.get(prop);
        };
        cf.title = config.title.bind(config);
        cf.version = config.version.bind(config);
        cf.get = config.get.bind(config);
        cf.set = config.set.bind(config);
        cf.unset = config.unset.bind(config);
        cf.mergeOptions = config.merge.bind(config);
        cf.raw = config.raw.bind(config);
        cf.process = config.process.bind(config);
        cf.has = config.has.bind(config);
        cf.dump = config.dump.bind(config);
        return cf;
    }
}
exports.Config = Config;
let _config = new Config(defaults);
exports.config = Config.makeProperty(_config);
//# sourceMappingURL=config.js.map