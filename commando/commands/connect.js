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
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
let ConnectGroup = class ConnectGroup extends src_1.Group {
};
ConnectGroup = __decorate([
    src_1.group('connect', 'SSH Connect', 'SSH Connect helper'), 
    __metadata('design:paramtypes', [])
], ConnectGroup);
exports.ConnectGroup = ConnectGroup;
let SetConnectCommand = class SetConnectCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            target: { desc: 'The target to connect to', required: true },
            host: { desc: 'Host url/ip (without port)' },
            port: { desc: 'Port' },
            method: { desc: 'Authentication method' },
            path: { desc: 'Local path', type: 'string' },
            hostPath: { desc: 'Host path' },
            user: { desc: 'User' },
            password: { desc: 'Password' }
        };
    }
    handle() {
        this.in.askArgs(this.parsed, {
            host: {},
            port: { default: '22' },
            method: { type: 'list', choices: ['key', 'password'] },
            path: {},
            hostPath: { default: '/' },
            user: {},
            password: { when: (answers) => answers.method === 'password' }
        }).then((a) => {
            this.conf.set('connect.' + this.arg('target'), a);
        });
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], SetConnectCommand.prototype, "conf", void 0);
SetConnectCommand = __decorate([
    src_1.command('set', 'Set target', 'Set a new/existing connect target', ConnectGroup), 
    __metadata('design:paramtypes', [])
], SetConnectCommand);
exports.SetConnectCommand = SetConnectCommand;
let ListConnectCommand = class ListConnectCommand extends src_1.Command {
    handle() {
        const targets = this.conf.get('connect');
        let table = this.out.columns(['Name', 'User', 'Host', 'Port', 'Method', 'Host path', 'Local path']);
        Object.keys(targets).forEach(name => {
            let target = targets[name];
            table.push([name,
                target.user,
                target.host,
                target.port.toString(),
                target.method,
                target.hostPath,
                target.path
            ]);
        });
        this.line(table.toString());
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], ListConnectCommand.prototype, "conf", void 0);
ListConnectCommand = __decorate([
    src_1.command('list', 'List all', 'List all connect targets', ConnectGroup), 
    __metadata('design:paramtypes', [])
], ListConnectCommand);
exports.ListConnectCommand = ListConnectCommand;
let RemoveConnectCommand = class RemoveConnectCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            target: { desc: 'The target', required: true }
        };
    }
    handle() {
        let target = this.arg('target'), key = 'connect.' + target;
        if (!this.conf.has(key)) {
            return this.fail('Target does not exist: ' + target);
        }
        this.conf.unset(key);
        this.out.success('Target has been removed: ' + target);
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], RemoveConnectCommand.prototype, "conf", void 0);
RemoveConnectCommand = __decorate([
    src_1.command('rm', 'Remove target', 'Remove connect target', ConnectGroup), 
    __metadata('design:paramtypes', [])
], RemoveConnectCommand);
exports.RemoveConnectCommand = RemoveConnectCommand;
let GetConnectCommand = class GetConnectCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            target: { desc: 'The target', required: true },
            key: { desc: 'The key', required: true }
        };
    }
    handle() {
        this.line(this.conf.get('connect.' + this.arg('target') + '.' + this.arg('key')));
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], GetConnectCommand.prototype, "conf", void 0);
GetConnectCommand = __decorate([
    src_1.command('get', 'Get target', 'Get connect target', ConnectGroup), 
    __metadata('design:paramtypes', [])
], GetConnectCommand);
exports.GetConnectCommand = GetConnectCommand;
let CmdConnectCommand = class CmdConnectCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            target: { desc: 'The target to connect to', required: true },
            type: { desc: 'The connection type' }
        };
        this.options = {
            d: { alias: 'dirs', desc: 'Handle directory create & delete (mount)' }
        };
        this.usage = 'connect get <target> [type=ssh]';
        this.bins = {
            ssh: 'ssh',
            sshfs: 'sshfs',
            sshpass: 'sshpass',
            umount: 'umount'
        };
    }
    handle() {
        let target = this.conf.get('connect.' + this.arg('target'));
        if (target === undefined)
            return this.fail(`Item "${this.arg('target')}" does not exist`);
        if (this[this.arg('type')] === undefined)
            return this.fail('Type does not exist');
        this[this.arg('type')](target);
    }
    mount(target) {
        let cmd = `${this.bins.sshfs} ${target.user}@${target.host}:${target.hostPath} ${target.path} -p ${target.port}`;
        if (target.method === 'password') {
            cmd = `echo ${target.password} | ${cmd} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o reconnect -o workaround=rename -o password_stdin`;
        }
        else {
            cmd += ' -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o reconnect -o workaround=rename';
        }
        if (this.opt('d')) {
            fs_extra_1.ensureDirSync(target.path);
        }
        this.line(cmd);
    }
    umount(target) {
        let cmd = `sudo ${this.bins.umount} ${target.path} -f`;
        child_process_1.execSync(cmd);
        fs_1.rmdirSync(target.path);
        this.line('');
    }
    ssh(target) {
        let cmd = '';
        if (target.method === 'password') {
            cmd = `${this.bins.sshpass} -p ${target.password} `;
        }
        cmd += `${this.bins.ssh} -o StrictHostKeyChecking=no ${target.user}@${target.host} -p ${target.port}`;
        this.line(cmd);
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], CmdConnectCommand.prototype, "conf", void 0);
CmdConnectCommand = __decorate([
    src_1.command('cmd', 'Get target', 'Get connect target', ConnectGroup), 
    __metadata('design:paramtypes', [])
], CmdConnectCommand);
exports.CmdConnectCommand = CmdConnectCommand;
class ConnectCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            target: { desc: 'The target to connect to' },
            type: { desc: 'The connection type' }
        };
        this.options = {
            s: { alias: 'set', desc: 'Set a new/existing connect target', boolean: true },
            l: { alias: 'list', desc: 'List all connect targets', boolean: true }
        };
    }
    handle() {
        if (this.opt('c')) {
        }
        if (this.opt('l')) {
            const list = this.conf.get('connect');
            this.out.dump(list);
        }
    }
}
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], ConnectCommand.prototype, "conf", void 0);
exports.ConnectCommand = ConnectCommand;
//# sourceMappingURL=connect.js.map