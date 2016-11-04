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
let ConfigGroup = class ConfigGroup extends src_1.Group {
};
ConfigGroup = __decorate([
    src_1.group('config', 'Configuration', 'Manage the global and local configuration'), 
    __metadata('design:paramtypes', [])
], ConfigGroup);
exports.ConfigGroup = ConfigGroup;
let ListConfigCommand = class ListConfigCommand extends src_1.Command {
    constructor(...args) {
        super(...args);
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
};
ListConfigCommand = __decorate([
    src_1.command('list', 'List Configuration', 'Give the current working directory a bit of R.', ConfigGroup), 
    __metadata('design:paramtypes', [])
], ListConfigCommand);
exports.ListConfigCommand = ListConfigCommand;
//# sourceMappingURL=config.js.map