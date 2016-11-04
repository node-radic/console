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
const con_1 = require("./con");
const util_1 = require("util");
let ListConnectionCommand = class ListConnectionCommand extends con_1.ConnectionCommand {
    handle() {
        super.handle();
        let table = this.out.columns(['Name', 'Remote', 'Auth Method', 'Extra']);
        this.connections.all().forEach((con) => {
            table.push([con.name, con.remote, con.method, util_1.inspect(con.extra, { colors: false, depth: 1, showHidden: false })]);
        });
        this.out.writeln(table.toString());
    }
};
ListConnectionCommand = __decorate([
    src_1.command('ls', 'List connections', 'List connections or remotes', con_1.ConnectionGroup), 
    __metadata('design:paramtypes', [])
], ListConnectionCommand);
exports.ListConnectionCommand = ListConnectionCommand;
//# sourceMappingURL=con_ls.js.map