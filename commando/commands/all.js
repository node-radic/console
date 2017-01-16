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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const src_1 = require("../../src");
const core_1 = require("../core");
const dgram = require('dgram');
const fs_extra_1 = require("fs-extra");
const lastpass_1 = require("lastpass");
const path_1 = require('path');
const globule_1 = require('globule');
let InitCommand = class InitCommand extends src_1.Command {
    handle() {
        const message = Buffer.from('Some bytes');
        const client = dgram.createSocket('udp4');
        client.send(message, 41234, 'localhost', (err) => {
            client.close();
        });
        client.bind(41235);
    }
};
InitCommand = __decorate([
    src_1.command('init', 'Initialize R', 'Give the current working directory a bit of R.'), 
    __metadata('design:paramtypes', [])
], InitCommand);
exports.InitCommand = InitCommand;
let TestCommand = class TestCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            username: { desc: 'Lastpass username/email' },
            password: { desc: 'The password (leave empty for secret prompt)' }
        };
    }
    handle() {
        this.askArg('username').then((username) => {
            let lpass = new lastpass_1.default(username);
            lpass.loadVaultFile(undefined).then(() => {
                this.after(lpass);
            }, (err) => {
                this.askArg('password', { type: 'password' }).then((password) => {
                    return this.lpass(username, password);
                }).then(() => {
                    this.after(lpass);
                });
            });
        });
    }
    after(lpass) {
        return __awaiter(this, void 0, void 0, function* () {
            this.out.success('after').dump(lpass);
            this.out.dump(lpass.getVault());
            let accounts = '';
            console.log(accounts);
            if (accounts) {
                lpass.saveVaultFile();
            }
        });
    }
    lpass(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let lpass = new lastpass_1.default(username);
            try {
                this.log.verbose('loadVaultFile');
                yield lpass.loadVaultFile(undefined);
            }
            catch (err) {
                this.log.verbose('loadVaultFile error');
                console.dir(err);
                try {
                    this.log.verbose('loadVault(username, password)');
                    yield lpass.loadVault(username, password);
                }
                catch (errLoad) {
                    this.log.verbose('loadVault(username, password) error');
                    console.error(errLoad.title);
                }
            }
            try {
                this.log.verbose('getVault');
                lpass.getVault();
            }
            catch (err) {
                this.log.verbose('getVault error');
                console.error(err.title);
                return;
            }
        });
    }
};
TestCommand = __decorate([
    src_1.command('test', 'Test R', 'Test a bit of R.'), 
    __metadata('design:paramtypes', [])
], TestCommand);
exports.TestCommand = TestCommand;
let PMoveCommand = class PMoveCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            from: { desc: 'Source directory', required: true },
            to: { desc: 'Target directory', required: true }
        };
    }
    handle() {
        var opts = {
            from: this.arg('from'),
            to: this.arg('to'),
            extensions: this.conf('pmove.extensions')
        };
        var c = this.conf.get();
        var dir = path_1.resolve(opts.from, '**', '*.{' + opts.extensions.join(',') + '}'), found = globule_1.find(dir);
        this.out.writeln(`Found ${found.length} files in {bold}${dir}{/bold} `);
        this.in.confirm('Do you want to continue?').then((answer) => {
            if (!answer)
                return this.log.warn('Canceled Pmove');
            fs_extra_1.ensureDirSync(path_1.resolve(opts.to));
            found.forEach((filePath, i) => {
                this.out.write(i.toString());
                var fileName = path_1.basename(filePath);
                this.log.verbose('renaming', filePath, path_1.resolve(opts.to, fileName));
                fs_extra_1.renameSync(filePath, path_1.resolve(opts.to, fileName));
            });
        });
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CONFIG), 
    __metadata('design:type', Function)
], PMoveCommand.prototype, "conf", void 0);
PMoveCommand = __decorate([
    src_1.command('pmove', 'PMove', 'PMove'), 
    __metadata('design:paramtypes', [])
], PMoveCommand);
exports.PMoveCommand = PMoveCommand;
let MakeBinCommand = class MakeBinCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {
            dest: { desc: 'Where to create this command' }
        };
    }
};
MakeBinCommand = __decorate([
    src_1.command('make-bin', 'Make a bash bin file', 'Make a bash bin file'), 
    __metadata('design:paramtypes', [])
], MakeBinCommand);
exports.MakeBinCommand = MakeBinCommand;
//# sourceMappingURL=all.js.map