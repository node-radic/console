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
const services_1 = require("../services");
const con_1 = require("./con");
let AddConnectionCommand = class AddConnectionCommand extends con_1.ConnectionCommand {
    constructor() {
        super(...arguments);
        this.usage = '$0 [name] <remote?> <method?> <key?> <secret> <extra??>';
        this.example = `
$0 bb  bitbucket        basic   username    password
$0 bbs bitbucket_server oauth2  a3#A$j342   2i34@k24j https://ci.radic.nl
`;
        this.arguments = {
            name: { desc: 'The name of the connection' },
            remote: { desc: 'Remote to connect to' },
            method: { desc: 'Auth method' },
            key: { desc: '' },
            secret: { desc: '' },
            extra: { desc: '' },
        };
    }
    validateName(name) {
        if (this.connections.has(name)) {
            return 'A connection with that name already exists';
        }
        return true;
    }
    handle() {
        let interact = this.getHelper('interaction');
        interact.askArgs({
            name: { type: 'input', message: 'name', validate: (input) => this.validateName(input) },
            remote: { type: 'list', message: 'remote', choices: (answers) => this.remotes.keys() },
            method: { type: 'list', message: 'authentication method', choices: (answers) => ['basic', 'oauth2', 'oauth', 'token'] },
            key: { type: 'input', message: (answers) => services_1.AuthMethod.getKeyName(answers.method || this.parsed.arg('method')) },
            secret: { type: 'password', message: (answers) => services_1.AuthMethod.getSecretName(answers.method || this.parsed.arg('method')) },
        }).then((args) => {
            this.out.dump(args);
            let model = this.connections.model(args);
            let validate = model.validate();
            if (validate.passes())
                return model.save();
            this.log.error('Validation errors', validate.errors.all());
            Object.keys(validate.errors.all()).forEach((argName) => {
                this.log.error(validate.errors.first(argName));
            });
        });
    }
};
AddConnectionCommand = __decorate([
    src_1.command('add', 'Add connection', 'Add a new connection', con_1.ConnectionGroup), 
    __metadata('design:paramtypes', [])
], AddConnectionCommand);
exports.AddConnectionCommand = AddConnectionCommand;
//# sourceMappingURL=con_add.js.map