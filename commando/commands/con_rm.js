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
let RemoveConnectionCommand = class RemoveConnectionCommand extends con_1.ConnectionCommand {
    constructor(...args) {
        super(...args);
        this.arguments = {
            name: { desc: 'The name of the connection' }
        };
    }
    handle() {
        let m = this.connections.model({
            name: 'asdf',
            remote: 'fff'
        });
        let v = m.validate();
        let pass = v.passes();
        let errors = v.errors;
        if (pass) {
            m.save();
        }
    }
    handle2() {
        this.askArgs({
            name: { type: 'list', message: 'Pick connections', choices: (answers) => this.connections.query.map('names').value() }
        }).then((args) => {
            this.out.dump(args);
        });
    }
};
RemoveConnectionCommand = __decorate([
    src_1.command('rm', 'Remove connection', 'Remove a connection', con_1.ConnectionGroup), 
    __metadata('design:paramtypes', [])
], RemoveConnectionCommand);
exports.RemoveConnectionCommand = RemoveConnectionCommand;
//# sourceMappingURL=con_rm.js.map