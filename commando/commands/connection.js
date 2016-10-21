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
var core_1 = require("../core");
var services_1 = require("../services");
var connection_1 = require("../services/connection");
var connection_remote_1 = require("../services/connection.remote");
var util_1 = require("util");
var ws = require('window-size');
var ConnectionGroup = (function (_super) {
    __extends(ConnectionGroup, _super);
    function ConnectionGroup() {
        _super.apply(this, arguments);
    }
    ConnectionGroup.prototype.handle = function () {
        this.showHelp('Connection Manager');
        this.out.header('Available Remotes');
        var table = this.out.columns();
        this.remotes.all().forEach(function (remote) {
            table.push([
                ("{skyblue}" + remote.prettyName + "{/skyblue}"),
                ("{grey}" + remote.name + "{/grey}")
            ]);
        });
        this.out.writeln(table.toString());
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.REMOTES), 
        __metadata('design:type', connection_remote_1.RemoteFactory)
    ], ConnectionGroup.prototype, "remotes", void 0);
    ConnectionGroup = __decorate([
        src_1.group('con', 'Connection Manager', 'Define connections to remote jenkins, jira, git, etc'), 
        __metadata('design:paramtypes', [])
    ], ConnectionGroup);
    return ConnectionGroup;
}(src_1.Group));
exports.ConnectionGroup = ConnectionGroup;
var ConnectionCommand = (function (_super) {
    __extends(ConnectionCommand, _super);
    function ConnectionCommand() {
        _super.apply(this, arguments);
    }
    ConnectionCommand.prototype.handle = function () {
        this.out.line("This is the {green}con " + this.name + "{/green} command");
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:type', connection_1.ConnectionRepository)
    ], ConnectionCommand.prototype, "connections", void 0);
    __decorate([
        core_1.inject(core_1.COMMANDO.REMOTES), 
        __metadata('design:type', connection_remote_1.RemoteFactory)
    ], ConnectionCommand.prototype, "remotes", void 0);
    ConnectionCommand = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ConnectionCommand);
    return ConnectionCommand;
}(src_1.Command));
exports.ConnectionCommand = ConnectionCommand;
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
    };
    AddConnectionCommand.prototype.handle = function () {
        var _this = this;
        _super.prototype.handle.call(this);
        var con = this.connections.find('connections');
        var m = this.connections.find('hello');
        var model = this.connections.model({
            name: 'hello',
            remote: 'bitbucket',
            method: 'basic',
            key: 'radic',
            secret: '',
            extra: JSON.stringify({ url: 'https://projects.radic.nl' })
        });
        model.save();
        this.cli.exit();
        this.askArgs({
            name: { type: 'input', message: 'name', validate: function (input) { return _this.validateName(input); } },
            remote: { type: 'list', message: 'remote', choices: function (answers) { return _this.remotes.names(); } },
            method: { type: 'list', message: 'authentication method', choices: function (answers) { return ['basic', 'oauth2', 'oauth', 'token']; } },
            key: { type: 'input', message: function (answers) { return services_1.AuthMethod.getKeyName(answers.method || _this.parsed.arg('method')); } },
            secret: { type: 'password', message: function (answers) { return services_1.AuthMethod.getSecretName(answers.method || _this.parsed.arg('method')); } },
        }, this.argv).then(function (args) {
            _this.out.dump(args);
            var model = _this.connections.model(args);
            model.save();
        });
    };
    AddConnectionCommand = __decorate([
        src_1.command('add', 'Add connection', 'Add a new connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], AddConnectionCommand);
    return AddConnectionCommand;
}(ConnectionCommand));
exports.AddConnectionCommand = AddConnectionCommand;
var ListConnectionCommand = (function (_super) {
    __extends(ListConnectionCommand, _super);
    function ListConnectionCommand() {
        _super.apply(this, arguments);
    }
    ListConnectionCommand.prototype.handle = function () {
        _super.prototype.handle.call(this);
        var head = ['Name', 'Remote', 'Auth Method', 'Extra'];
        var table = this.out.columns({
            head: head
        });
        var cols = process.stdout['columns'];
        function calc(head, max) {
            if (max === void 0) { max = 100; }
            var percentWidth = max / 100;
            var colPercent = 100 / head.length;
            var colWidth = colPercent * percentWidth;
            return head.map(function (col) {
                return colWidth;
            });
        }
        var colsWidth = calc(head, ws.width);
        this.connections.all().forEach(function (con) {
            table.push([con.name, con.remote, con.method, util_1.inspect(con.extra, { colors: false, depth: 1, showHidden: false })]);
        });
        this.out.writeln(table.toString());
        var a = 'a';
    };
    ListConnectionCommand = __decorate([
        src_1.command('list', 'List connections', 'List connections or remotes', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ListConnectionCommand);
    return ListConnectionCommand;
}(ConnectionCommand));
exports.ListConnectionCommand = ListConnectionCommand;
var RemoveConnectionCommand = (function (_super) {
    __extends(RemoveConnectionCommand, _super);
    function RemoveConnectionCommand() {
        _super.apply(this, arguments);
    }
    RemoveConnectionCommand = __decorate([
        src_1.command('rm', 'Remove connection', 'Remove a connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], RemoveConnectionCommand);
    return RemoveConnectionCommand;
}(ConnectionCommand));
exports.RemoveConnectionCommand = RemoveConnectionCommand;
var CopyConnectionCommand = (function (_super) {
    __extends(CopyConnectionCommand, _super);
    function CopyConnectionCommand() {
        _super.apply(this, arguments);
    }
    CopyConnectionCommand = __decorate([
        src_1.command('cp', 'Copy connection', 'Create a new connection based on an existing one', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], CopyConnectionCommand);
    return CopyConnectionCommand;
}(ConnectionCommand));
exports.CopyConnectionCommand = CopyConnectionCommand;
var EditConnectionCommand = (function (_super) {
    __extends(EditConnectionCommand, _super);
    function EditConnectionCommand() {
        _super.apply(this, arguments);
    }
    EditConnectionCommand = __decorate([
        src_1.command('edit', 'Edit connection', 'Edit a existing connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], EditConnectionCommand);
    return EditConnectionCommand;
}(ConnectionCommand));
exports.EditConnectionCommand = EditConnectionCommand;
//# sourceMappingURL=connection.js.map