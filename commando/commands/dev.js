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
var lodash = require("lodash");
var src_1 = require("../../src");
var core_1 = require("../core");
var connection_1 = require("../services/connection");
var DevGroup = (function (_super) {
    __extends(DevGroup, _super);
    function DevGroup() {
        _super.apply(this, arguments);
    }
    DevGroup.prototype.fire = function () {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
        _super.prototype.fire.call(this);
    };
    DevGroup = __decorate([
        src_1.group('dev', 'Dev/Debug Commands', 'Extra commands for debugging and development purposes'), 
        __metadata('design:paramtypes', [])
    ], DevGroup);
    return DevGroup;
}(src_1.Group));
exports.DevGroup = DevGroup;
var DevCommand = (function (_super) {
    __extends(DevCommand, _super);
    function DevCommand() {
        _super.apply(this, arguments);
    }
    DevCommand.prototype.fire = function () {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
        _super.prototype.fire.call(this);
    };
    DevCommand = __decorate([
        src_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], DevCommand);
    return DevCommand;
}(src_1.Command));
exports.DevCommand = DevCommand;
var ConDevCommand = (function (_super) {
    __extends(ConDevCommand, _super);
    function ConDevCommand() {
        _super.apply(this, arguments);
        this.cons = [];
    }
    ConDevCommand.prototype.handle = function () {
        var _this = this;
        this.con('projects', 'jira', 'radic', { extra: { url: 'https://projects.radic.nl' } });
        this.con('gh', 'github', 'robinradic');
        this.con('bb', 'bitbucket', 'robinradic');
        this.con('bbs', 'bitbucket_server', 'radic', { extra: { url: 'https://git.radic.nl' } });
        this.out.dump(this.cons);
        this.in.ask('Do you want to save these connections?', { type: 'confirm' }).then(function (answer) {
            if (answer === true) {
                _this.log.info('Saving connections');
                _this.cons.forEach(function (con) {
                    _this.log.debug('Connection ' + con.name + ': saving', con);
                    _this.connections.model(con).save();
                    _this.log.debug('Connection ' + con.name + ': saved', con);
                });
                return _this.log.info('Connections saved');
            }
            _this.log.warn('Canceled operation');
        });
    };
    ConDevCommand.prototype.con = function (name, remote, key, opts) {
        if (key === void 0) { key = 'radic'; }
        if (opts === void 0) { opts = {}; }
        opts = lodash.merge({
            name: name, remote: remote, key: key,
            method: 'basic',
            secret: null,
            extra: {}
        }, opts);
        opts.secret = opts.secret || core_1.config('env.radic.password');
        this.cons.push(opts);
    };
    ConDevCommand.prototype.add = function (con) {
    };
    __decorate([
        src_1.inject(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:type', connection_1.ConnectionRepository)
    ], ConDevCommand.prototype, "connections", void 0);
    ConDevCommand = __decorate([
        src_1.command('con', 'Connections Seeder', 'Add working connections for testing for all remotes.', DevGroup), 
        __metadata('design:paramtypes', [])
    ], ConDevCommand);
    return ConDevCommand;
}(DevCommand));
exports.ConDevCommand = ConDevCommand;
//# sourceMappingURL=dev.js.map