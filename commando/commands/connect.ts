import { Group, group, command, Command } from "../../src";
import { injectable, inject, COMMANDO, IConfigProperty } from "../core";
import { mkdir, rm } from "shelljs";
import { ensureDir, ensureDirSync } from "fs-extra";
import { rmdir } from "fs";
import { rmdirSync } from "fs";
import { spawn } from "child_process";
import { execSync } from "child_process";

// import * as dgram from 'dgram';

// import { paths } from "../core/paths";
// import { unlinkSync } from "fs";
// import { copySync, renameSync, ensureDirSync } from "fs-extra";
// import * as moment from 'moment';
// import Lastpass from "lastpass";
// import { basename, resolve } from 'path'
// import { find } from 'globule'
/*
r connect set radic-root radic.nl 60000 key /mnt/radic-root / root
r connect set jenkins-radic radic.nl 60000 key /mnt/jenkins-root /var/lib/jenkins jenkins
r connect set radic-nl radic.nl 60000 key /mnt/radic-nl /var/www/vhosts/radic.nl radic-nl
r connect set codex codex-project.ninja 60000 key /mnt/codex-project /var/www/vhosts/codex-project.ninja codex-project


 */

export interface IConnectSSHTarget {
    host?: string
    port?: string|number
    method?: "key" | "password" | string
    path?: string
    hostPath?: string
    user?: string
    password?: string
}

@group('connect', 'SSH Connect', 'SSH Connect helper')
export class ConnectGroup extends Group {

}

@command('set', 'Set target', 'Set a new/existing connect target', ConnectGroup)
export class SetConnectCommand extends Command {
    @inject(COMMANDO.CONFIG) conf: IConfigProperty;

    arguments = {
        target  : { desc: 'The target to connect to', required: true },
        host    : { desc: 'Host url/ip (without port)' },
        port    : { desc: 'Port' },
        method  : { desc: 'Authentication method' }, //, 'lastpass'
        path    : { desc: 'Local path', type: 'string' },
        hostPath: { desc: 'Host path' },
        user    : { desc: 'User' },
        password: { desc: 'Password'}
    }

    handle() {

        this.in.askArgs(this.parsed, {
            host    : {},
            port    : { default: '22' },
            method  : { type: 'list', choices: [ 'key', 'password' ] }, //, 'lastpass'
            path    : {},
            hostPath: { default: '/' },
            user    : {},
            password: { when: (answers: any) => answers.method === 'password' }
        }).then((a: any) => {
                this.conf.set('connect.' + this.arg('target'), a);
            });
    }
}

@command('list', 'List all', 'List all connect targets', ConnectGroup)
export class ListConnectCommand extends Command {
    @inject(COMMANDO.CONFIG) conf: IConfigProperty;

    handle() {
        const targets = this.conf.get('connect');
        let table     = this.out.columns([ 'Name', 'User', 'Host', 'Port', 'Method', 'Host path', 'Local path' ]);
        Object.keys(targets).forEach(name => {
            let target: IConnectSSHTarget = targets[ name ];
            table.push([ name,
                target.user,
                target.host,
                target.port.toString(),
                target.method,
                target.hostPath,
                target.path
            ])
        })
        this.line(table.toString())
    }
}
@command('rm', 'Remove target', 'Remove connect target', ConnectGroup)
export class RemoveConnectCommand extends Command {
    @inject(COMMANDO.CONFIG)
    conf: IConfigProperty;

    arguments = {
        target: { desc: 'The target', required: true }
    }

    handle() {
        let target = this.arg('target'),
            key = 'connect.' + target;
        if(!this.conf.has(key)){
            return this.fail('Target does not exist: ' + target);
        }
        this.conf.unset(key);
        this.out.success('Target has been removed: ' + target);
    }
}


@command('get', 'Get target', 'Get connect target', ConnectGroup)
export class GetConnectCommand extends Command {
    @inject(COMMANDO.CONFIG)
    conf: IConfigProperty;

    arguments = {
        target: { desc: 'The target', required: true },
        key   : { desc: 'The key', required: true }
    }

    handle() {
        this.line(this.conf.get('connect.' + this.arg('target') + '.' + this.arg('key')))
    }
}

@command('cmd', 'Get target', 'Get connect target', ConnectGroup)
export class CmdConnectCommand extends Command {

    @inject(COMMANDO.CONFIG)
    conf: IConfigProperty;

    arguments = {
        target: { desc: 'The target to connect to', required: true },
        type  : { desc: 'The connection type' }
    }

    options = {
        d: { alias: 'dirs', desc: 'Handle directory create & delete (mount)' }
    }

    usage = 'connect get <target> [type=ssh]';

    bins = {
        ssh    : 'ssh',
        sshfs  : 'sshfs',
        sshpass: 'sshpass',
        umount : 'umount'
    }

    handle() {
        let target: IConnectSSHTarget = <any> this.conf.get('connect.' + this.arg('target'))
        if ( target === undefined ) return this.fail(`Item "${this.arg('target')}" does not exist`)
        if ( this[ this.arg('type') ] === undefined ) return this.fail('Type does not exist');

        this[ this.arg('type') ](target);
    }

    mount(target: IConnectSSHTarget) {
        let cmd: string = `${this.bins.sshfs} ${target.user}@${target.host}:${target.hostPath} ${target.path} -p ${target.port}`;
        if ( target.method === 'password' ) {
            cmd = `echo ${target.password} | ${cmd} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o reconnect -o workaround=rename -o password_stdin`
        } else {
            cmd += ' -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o reconnect -o workaround=rename';
        }
        if ( this.opt('d') ) {
            ensureDirSync(target.path);
        }
        this.line(cmd);
    }

    umount(target: IConnectSSHTarget) {
        let cmd: string = `sudo ${this.bins.umount} ${target.path} -f`;
        execSync(cmd);
        rmdirSync(target.path);
        this.line('');
    }

    ssh(target: IConnectSSHTarget) {
        let cmd = '';
        if ( target.method === 'password' ) {
            cmd = `${this.bins.sshpass} -p ${target.password} `

        }

        cmd += `${this.bins.ssh} -o StrictHostKeyChecking=no ${target.user}@${target.host} -p ${target.port}`;

        this.line(cmd);
    }
}

export class ConnectCommand extends Command {
    arguments = {
        target: { desc: 'The target to connect to' },
        type  : { desc: 'The connection type' }
    }
    options   = {
        s: { alias: 'set', desc: 'Set a new/existing connect target', boolean: true },
        l: { alias: 'list', desc: 'List all connect targets', boolean: true }
    }
    @inject(COMMANDO.CONFIG) conf: IConfigProperty;

    handle() {
        if ( this.opt('c') ) {
        }
        if ( this.opt('l') ) {
            const list = this.conf.get('connect');
            this.out.dump(list);
        }
    }
}
