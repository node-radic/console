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
const services_1 = require("../services");
let ConnectionGroup = class ConnectionGroup extends src_1.Group {
    handle() {
        this.showHelp('Connection Manager');
        this.out.header('Available Remotes');
        let table = this.out.columns();
        this.remotes.values().forEach((remote) => {
            table.push([
                `{skyblue}${remote.prettyName}{/skyblue}`,
                `{grey}${remote.name}{/grey}`
            ]);
        });
        this.out.writeln(table.toString());
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.REMOTES), 
    __metadata('design:type', services_1.RemoteFactory)
], ConnectionGroup.prototype, "remotes", void 0);
ConnectionGroup = __decorate([
    src_1.group('con', 'Connection Manager', 'Define connections to remote jenkins, jira, git, etc'), 
    __metadata('design:paramtypes', [])
], ConnectionGroup);
exports.ConnectionGroup = ConnectionGroup;
let ConnectionCommand = class ConnectionCommand extends src_1.Command {
    handle() {
        this.out.line(`This is the {green}con ${this.name}{/green} command`);
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONNECTIONS), 
    __metadata('design:type', services_1.ConnectionRepository)
], ConnectionCommand.prototype, "connections", void 0);
__decorate([
    core_1.inject(core_1.COMMANDO.REMOTES), 
    __metadata('design:type', services_1.RemoteFactory)
], ConnectionCommand.prototype, "remotes", void 0);
ConnectionCommand = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], ConnectionCommand);
exports.ConnectionCommand = ConnectionCommand;
//# sourceMappingURL=con.js.map