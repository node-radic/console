"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const src_1 = require("../../src");
const core_1 = require("../core");
const src_2 = require("../../src");
const util_1 = require("@radic/util");
class ConfigGroup extends src_1.Group {
}
exports.ConfigGroup = ConfigGroup;
class ListConfigCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            type: { desc: 'The config type (console|commando)', type: 'string', default: 'commando' }
        };
    }
    handle() {
        this.out.subtitle(this.arg('type'));
        this[this.arg('type')].apply(this);
    }
    commando() {
        this.out.dump(src_2.kernel.get(core_1.COMMANDO.CONFIG));
    }
    console() {
        this.out.dump(this.config.raw());
    }
}
exports.ListConfigCommand = ListConfigCommand;
let ConfigCommand = class ConfigCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            key: { desc: 'The config key', type: 'string' },
            value: { desc: 'The config key', type: 'string' },
            type: { desc: 'The config key', type: 'string' }
        };
        this.options = {
            list: { alias: 'l', desc: 'Output configuration as dot-notaded list', string: true },
            tree: { alias: 't', desc: 'Output configuration as tree', string: true }
        };
    }
    handle() {
        let k = this.arg('key');
        let v = this.arg('value');
        let t = this.arg('type');
        if (this.opt('l') || this.opt('t')) {
            let items = this.config(this.arg('key'));
            return this.out.dump(this.opt('l') ? util_1.dotize(items) : items);
        }
        if (!this.hasArg('value')) {
            return this.out.dump(this.config(k));
        }
        if (!this.arg('type')) {
            return this.fail(`Could not set value for [${k}]. Missing the the type (third argument).`);
        }
        if (t === 'number') {
            v = parseInt(v);
        }
        this.config.set(k, JSON.parse(v));
    }
};
ConfigCommand = __decorate([
    src_1.command('config', 'Configuration Tool', 'Show, add, edit and remove configuration values.'), 
    __metadata('design:paramtypes', [])
], ConfigCommand);
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=config.js.map