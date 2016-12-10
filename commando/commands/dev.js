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
const _ = require("lodash");
const src_1 = require("../../src");
const core_1 = require("../core");
const connection_1 = require("../services/connection");
const child_process_1 = require('child_process');
let DevGroup = class DevGroup extends src_1.Group {
    fire() {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
        super.fire();
    }
};
DevGroup = __decorate([
    src_1.group('dev', 'Dev/Debug Commands', 'Extra commands for debugging and development purposes'), 
    __metadata('design:paramtypes', [])
], DevGroup);
exports.DevGroup = DevGroup;
let DevCommand = class DevCommand extends src_1.Command {
    fire() {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
        super.fire();
    }
};
DevCommand = __decorate([
    src_1.injectable(), 
    __metadata('design:paramtypes', [])
], DevCommand);
exports.DevCommand = DevCommand;
let ConDevCommand = class ConDevCommand extends DevCommand {
    constructor(...args) {
        super(...args);
        this.cons = [];
    }
    handle() {
        this.con('projects', 'jira', 'radic', { extra: { url: 'https://projects.radic.nl' } });
        this.con('gh', 'github', 'robinradic');
        this.con('bb', 'bitbucket', 'robinradic');
        this.con('bbs', 'bitbucket_server', 'radic', { extra: { url: 'https://git.radic.nl' } });
        this.out.dump(this.cons);
        this.in.askSecret('Password to use').then((secret) => this.in.ask('Do you want to save these connections?', { type: 'confirm' }).then((answer) => {
            if (answer === true) {
                this.log.info('Saving connections');
                this.cons.forEach((con) => {
                    con.secret = secret;
                    this.log.verbose('Connection ' + con.name + ': saving', con);
                    this.connections.model(con).save();
                    this.log.verbose('Connection ' + con.name + ': saved', con);
                });
                return this.log.info('Connections saved');
            }
            this.log.warn('Canceled operation');
        }));
    }
    con(name, remote, key = 'radic', opts = {}) {
        opts = _.merge({
            name, remote, key,
            method: 'basic',
            secret: null,
            extra: {}
        }, opts);
        opts.secret = opts.secret || core_1.config('env.radic.password');
        this.cons.push(opts);
    }
    add(con) {
    }
};
__decorate([
    src_1.inject(core_1.COMMANDO.CONNECTIONS), 
    __metadata('design:type', connection_1.ConnectionRepository)
], ConDevCommand.prototype, "connections", void 0);
ConDevCommand = __decorate([
    src_1.command('con', 'Connections Seeder', 'Add working connections for testing for all remotes.', DevGroup), 
    __metadata('design:paramtypes', [])
], ConDevCommand);
exports.ConDevCommand = ConDevCommand;
let ChromiumRemoteDebugDevCommand = class ChromiumRemoteDebugDevCommand extends DevCommand {
    handle() {
        const browser = child_process_1.spawn('chromium-browser', ['--remote-debugging-port=9222'], {
            detached: true,
            stdio: process.stdin
        });
    }
};
ChromiumRemoteDebugDevCommand = __decorate([
    src_1.command('chromium', 'Chromium Remote Debugging', 'Start your host Chrome instance with the remote-debugging-port command line switch.', DevGroup), 
    __metadata('design:paramtypes', [])
], ChromiumRemoteDebugDevCommand);
exports.ChromiumRemoteDebugDevCommand = ChromiumRemoteDebugDevCommand;
//# sourceMappingURL=dev.js.map