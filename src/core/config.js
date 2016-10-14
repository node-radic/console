"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util = require("@radic/util");
var defaults = {
    app: {
        title: undefined,
        description: undefined,
        version: undefined,
    },
    colors: {
        enabled: true,
        title: 'green bold',
        subtitle: 'yellow',
        header: 'darkorange bold',
        group: 'steelblue bold',
        command: 'skyblue',
        description: 'grey',
        argument: 'yellow darken 50'
    },
    descriptor: {
        cli: {
            showTitle: true,
            showVersion: true,
            showDescription: true,
        },
        text: {
            commands: 'Commands',
            options: 'Options',
            globalOptions: 'Global Options'
        }
    }
};
var Config = (function (_super) {
    __extends(Config, _super);
    function Config() {
        _super.apply(this, arguments);
    }
    Config.prototype.title = function (title) {
        this.set('app.title', title);
        return this;
    };
    Config.prototype.version = function (title) {
        this.set('app.version', title);
        return this;
    };
    Config.prototype.description = function (title) {
        this.set('app.description', title);
        return this;
    };
    Config.prototype.dump = function () {
        console.dir(this.data, { colors: true, showHidden: true });
    };
    Config.makeProperty = function (config) {
        var cf = function (prop) {
            return config.get(prop);
        };
        cf.title = config.title.bind(config);
        cf.version = config.version.bind(config);
        cf.get = config.get.bind(config);
        cf.set = config.set.bind(config);
        cf.unset = config.unset.bind(config);
        cf.merge = config.merge.bind(config);
        cf.raw = config.raw.bind(config);
        cf.process = config.process.bind(config);
        cf.has = config.has.bind(config);
        cf.dump = config.dump.bind(config);
        return cf;
    };
    return Config;
}(util.Config));
exports.Config = Config;
var _config = new Config(defaults);
exports.config = Config.makeProperty(_config);
//# sourceMappingURL=config.js.map