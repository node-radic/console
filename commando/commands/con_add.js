"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var src_1 = require("../../src");
var services_1 = require("../services");
var con_1 = require("./con");
var AddConnectionCommand = (function (_super) {
    __extends(AddConnectionCommand, _super);
    function AddConnectionCommand() {
        _super.apply(this, arguments);
        this.usage = '$0 [name] <remote?> <method?> <key?> <secret> <extra??>';
        this.example = "\n$0 bb  bitbucket        basic   username    password\n$0 bbs bitbucket_server oauth2  a3#A$j342   2i34@k24j https://ci.radic.nl\n";
        this.arguments = {
            name: { desc: 'The name of the connection' },
            remote: { desc: 'Remote to connect to' },
            method: { desc: 'Auth method' },
            key: { desc: '' },
            secret: { desc: '' },
            extra: { desc: '' },
        };
    }
    AddConnectionCommand.prototype.validateName = function (name) {
        if (this.connections.has(name)) {
            return 'A connection with that name already exists';
        }
        return true;
    };
    AddConnectionCommand.prototype.handle = function () {
        var _this = this;
        var interact = this.getHelper('interaction');
        interact.askArgs({
            name: { type: 'input', message: 'name', validate: function (input) { return _this.validateName(input); } },
            remote: { type: 'list', message: 'remote', choices: function (answers) { return _this.remotes.names(); } },
            method: { type: 'list', message: 'authentication method', choices: function (answers) { return ['basic', 'oauth2', 'oauth', 'token']; } },
            key: { type: 'input', message: function (answers) { return services_1.AuthMethod.getKeyName(answers.method || _this.parsed.arg('method')); } },
            secret: { type: 'password', message: function (answers) { return services_1.AuthMethod.getSecretName(answers.method || _this.parsed.arg('method')); } },
        }).then(function (args) {
            _this.out.dump(args);
            var model = _this.connections.model(args);
            var validate = model.validate();
            if (validate.passes())
                return model.save();
            _this.log.error('Validation errors', validate.errors.all());
            Object.keys(validate.errors.all()).forEach(function (argName) {
                _this.log.error(validate.errors.first(argName));
            });
        });
    };
    AddConnectionCommand = __decorate([
        src_1.command('add', 'Add connection', 'Add a new connection', con_1.ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], AddConnectionCommand);
    return AddConnectionCommand;
}(con_1.ConnectionCommand));
exports.AddConnectionCommand = AddConnectionCommand;
//# sourceMappingURL=con_add.js.map