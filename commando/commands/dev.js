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
const udp_1 = require("../services/udp");
const dgram_1 = require('dgram');
const paths_1 = require("../core/paths");
const path_1 = require('path');
const fs_extra_1 = require('fs-extra');
const moment = require('moment');
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
let PathsDevCommand = class PathsDevCommand extends DevCommand {
    handle() {
        let table = this.out.columns();
        Object.keys(this.paths).forEach(name => table.push([name, this.paths[name]]));
        this.line(table.toString());
    }
};
__decorate([
    src_1.inject(core_1.COMMANDO.PATHS), 
    __metadata('design:type', Object)
], PathsDevCommand.prototype, "paths", void 0);
PathsDevCommand = __decorate([
    src_1.command('paths', 'Show paths', 'paths', DevGroup), 
    __metadata('design:paramtypes', [])
], PathsDevCommand);
exports.PathsDevCommand = PathsDevCommand;
let ServeDevCommand = class ServeDevCommand extends DevCommand {
    handle() {
        this.server.start();
    }
};
__decorate([
    src_1.inject(core_1.COMMANDO.DGRAM_SERVER), 
    __metadata('design:type', udp_1.Server)
], ServeDevCommand.prototype, "server", void 0);
ServeDevCommand = __decorate([
    src_1.command('serve', 'Test udp server', 'Test udp server', DevGroup), 
    __metadata('design:paramtypes', [])
], ServeDevCommand);
exports.ServeDevCommand = ServeDevCommand;
let ClientDevCommand = class ClientDevCommand extends DevCommand {
    handle() {
        this.client.connect();
    }
};
__decorate([
    src_1.inject(core_1.COMMANDO.DGRAM_CLIENT), 
    __metadata('design:type', udp_1.Client)
], ClientDevCommand.prototype, "client", void 0);
ClientDevCommand = __decorate([
    src_1.command('client', 'Test udp client', 'Test udp client', DevGroup), 
    __metadata('design:paramtypes', [])
], ClientDevCommand);
exports.ClientDevCommand = ClientDevCommand;
let ConDevCommand = class ConDevCommand extends DevCommand {
    constructor() {
        super(...arguments);
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
let DopDevCommand = class DopDevCommand extends DevCommand {
    constructor() {
        super(...arguments);
        this.options = {
            serve: { alias: 's', default: false },
            host: { alias: 'h', default: '10.0.0.81', type: 'string' },
            port: { alias: 'p', default: 44411, type: 'number' },
            'client-port': { alias: 'c', default: 44422, type: 'number' },
            logpath: { alias: 'L', default: () => path_1.resolve(paths_1.paths.user, '.server-doplog'), type: 'string' },
            log: { alias: 'l', default: false }
        };
        this.arguments = {
            amount: { type: 'string' }
        };
    }
    handle() {
        if (this.opt('serve')) {
            return this.serve();
        }
        this.client();
    }
    serve() {
        let sock = dgram_1.createSocket('udp4');
        sock.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            sock.close();
        });
        let logPath = this.opt('logpath');
        sock.on('message', (msg, rinfo) => {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
            fs_extra_1.ensureFileSync(logPath);
            msg = msg.toString();
            if (msg.toString().trim() === 'log') {
                sock.send(fs_extra_1.readFileSync(logPath), rinfo.port, rinfo.address);
            }
            else {
                fs_extra_1.appendFileSync(logPath, '\n' + moment().format('hh:mm') + ' = ' + msg);
            }
        });
        sock.on('listening', () => {
            var net = sock.address();
            console.log(`server listening ${net.address}:${net.port}`);
        });
        sock.bind({ port: this.opt('port'), address: this.opt('host') });
    }
    createPackage() {
        return new Package(this.opt('port'), this.opt('host'));
    }
    client() {
        if (this.opt('log')) {
            return this.showLog();
        }
        this.askArg('amount', 'amount').then((answer) => {
            this.doLog(answer);
        });
    }
    doLog(msg) {
        this.createPackage().setData(msg).send().catch((err) => this.onError(err)).then((pkg) => {
            console.log('Dop logged');
        });
    }
    showLog() {
        this.createPackage()
            .setData('log')
            .returnsData()
            .send()
            .catch(this.onError)
            .then((pkg) => {
            this.out.writeln('{header}Doplog{/header}');
            this.out.writeln(pkg.result);
        });
    }
    onError(err) {
        console.log('error ', err);
        throw err;
    }
};
DopDevCommand = __decorate([
    src_1.command('dop', 'dop command', 'dopper de dop', DevGroup), 
    __metadata('design:paramtypes', [])
], DopDevCommand);
exports.DopDevCommand = DopDevCommand;
class Package {
    constructor(serverPort, serverHost, data = '') {
        this.serverPort = serverPort;
        this.serverHost = serverHost;
        this.data = data;
        this.port = 44422;
        this.listening = false;
        this.closed = false;
        this.done = false;
        this.result = undefined;
        this.error = undefined;
        this.listen = false;
        this.listenHandler = (msg, rinfo) => { };
    }
    static create(sPort, sHost) { return new Package(sPort, sHost); }
    setData(data) {
        this.data = data;
        return this;
    }
    returnsData() {
        this.listen = true;
        return this;
    }
    send() {
        this.createSocket();
        if (this.listen) {
            this.listenToServer();
        }
        return new Promise((resolve, reject) => {
            this.sendToServer(this.data, () => {
                if (this.error)
                    return reject(this.error);
                resolve(this);
            });
        });
    }
    createSocket() {
        this.sock = dgram_1.createSocket('udp4');
        this.sock.on('close', () => {
            this.listening = false;
            this.closed = true;
        });
        this.sock.on('listening', () => {
            this.listening = true;
            const ai = this.sock.address();
        });
        this.sock.on('error', () => this.onError());
    }
    listenToServer() {
        this.sock.on('message', (msg, rinfo) => {
            this.listenHandler.apply(this, [msg, rinfo]);
        });
        this.sock.bind({ port: this.port, address: '0.0.0.0' });
    }
    sendToServer(request, cb) {
        this.sock.send(this.data, this.serverPort, this.serverHost, (err) => {
            if (err) {
                this.error = err;
                cb(this);
                return this.onError(err);
            }
            if (this.listen) {
                return this.listenHandler = (msg, rinfo) => {
                    this.result = msg;
                    cb(this);
                };
            }
            this.sock.close();
            cb(this);
        });
    }
    onError(err) {
        this.sock.close();
        console.log('error');
    }
}
class Request {
    constructor(command, ...params) {
        this.command = command;
        this.params = params;
    }
    toJson() {
        let data = {
            command: this.command,
            params: this.params.map((param) => param.toString())
        };
        return JSON.stringify(data);
    }
    toString() {
        return this.toJson();
    }
    static fromJson(json) {
        let data = JSON.parse(json);
        return new Request(data.command, data.params);
    }
}
//# sourceMappingURL=dev.js.map