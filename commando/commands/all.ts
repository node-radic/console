import { Group, group, command, Command } from "../../src";
import * as dgram from 'dgram';

import { paths } from "../core/paths";
import { unlinkSync } from "fs";
import { copySync, renameSync, ensureDirSync } from "fs-extra";
import * as moment from 'moment';
import Lastpass from "lastpass";
import {basename, resolve} from 'path'
import {find} from 'globule'

@command('init', 'Initialize R', 'Give the current working directory a bit of R.')
export class InitCommand extends Command {
    handle() {

        const message = Buffer.from('Some bytes');
        const client = dgram.createSocket('udp4');
        client.send(message, 41234, 'localhost', (err) => {
            client.close();
        });
        client.bind(41235)
    }
}

@command('test', 'Test R', 'Test a bit of R.')
export class TestCommand extends Command {
    arguments = {
        username: { desc: 'Lastpass username/email' },
        password: { desc: 'The password (leave empty for secret prompt)' }
    }

    handle() {
        this.askArg('username').then((username: string) => {
            let lpass = new Lastpass(username)
            lpass.loadVaultFile(undefined).then(() => {
                this.after(lpass);
            }, (err) => {
                this.askArg('password', { type: 'password' }).then((password: string) => {
                    return this.lpass(username, password)
                }).then(() => {
                    this.after(lpass)
                })

            })
        })

    }

    async after(lpass: Lastpass) {
        this.out.success('after').dump(lpass)
        this.out.dump(lpass.getVault())

        // Try to load some accounts
        // Search is an object with 2 properties like so:
        // {
        //   keyword: 'Term to search for',
        //   options: { key: 'name of key in account object', maxResults: 2 },
        // }
        // Leaving search undefined returns all accounts
        // const accounts = await  lpass.getAccounts(
        //     username,
        //     password,
        //     undefined,
        // );

        let accounts = '';
        console.log(accounts);

        // If accounts are loaded save the vault to use later.
        // Because no path is given it gets saved to `~/.lastpass-vault-${USERNAME}`
        if ( accounts ) {
            lpass.saveVaultFile();
        }
    }

    async lpass(username: string, password?: string) {
        let lpass = new Lastpass(username)
        try {
            this.log.verbose('loadVaultFile')
            await lpass.loadVaultFile(undefined)
        } catch ( err ) {
            this.log.verbose('loadVaultFile error')
            console.dir(err);
            try {
                this.log.verbose('loadVault(username, password)')
                // Else try to get vault without 2FA
                await lpass.loadVault(username, password);
            } catch ( errLoad ) {
                this.log.verbose('loadVault(username, password) error')
                console.error(errLoad.title);
                // if (errLoad && errLoad.body && errLoad.body.cause === 'googleauthrequired') {
                //     // Else try to get vault with 2FA
                //     const twoFactor = await question('2 Factor Authentication Pin: ');
                //     await lpass.loadVault(username, password, twoFactor);
                // }
            }
        }

        // Check if vault is actually loaded... sometimes it's not :(
        try {
            this.log.verbose('getVault')
            lpass.getVault();
        } catch ( err ) {
            this.log.verbose('getVault error')
            console.error(err.title);
            return;
        }


    }
}

@command('connect', 'SSH Connect Helper', 'SSH Connect Helper')
export class ConnectCommand extends Command {
    arguments = {
        target: { desc: 'The target to connect to' },
        type  : { desc: 'The connection type' }
    }
    options   = {
        c: { alias: 'create', desc: 'Create a new connect target', boolean: true },
        l: { alias: 'list', desc: 'List all connect targets', boolean: true }
    }

    handle() {
        if ( this.opt('c') ) {
            this.in.askChoice('Authentication method', [ 'key', 'password', 'lastpass' ]).then((answer: string) => {
                this.in.prompt([
                    { name: 'host', message: 'Target Host url/ip (without port)', type: 'input' },
                    { name: 'port', message: 'Target port', type: 'input', default: '22' },
                    { name: 'method', message: 'Authentication method', type: 'list', choices: [ 'key', 'password', 'lastpass' ] },
                    { name: 'user', message: 'User' }
                ]).then((answers: any) => {
                    this.out.dump(answers)
                })
            })
        }
        if ( this.opt('l') ) {

        }
    }
}



@command('pmove', 'PMove', 'PMove')
export class PMoveCommand extends Command {
    arguments = {
        from: {desc:'Source directory', required: true},
        to: {desc:'Target directory', required: true}
    }
    handle(){
        var opts = {
            from      : this.arg('from'),
            to        : this.arg('to'),
            extensions: ['mp4', 'wma', 'flv', 'mkv', 'avi', 'wmv']
        };

        //
        // var path = require('path'),
        //     fs   = require('fs'),
        //     glob = require('globule');


        var dir = resolve(opts.from, '**', '*.{' + opts.extensions.join(',') + '}'),
            found = find(dir);


        this.out.writeln(`Found ${found.length} files in {bold}${dir}{/bold} `)

        this.in.confirm('Do you want to continue?').then((answer:boolean) => {
            if(!answer) return this.log.warn('Canceled Pmove');
            ensureDirSync(resolve(opts.to))
            found.forEach((filePath:string, i : number) => {
                this.out.write(i.toString());
                var fileName = basename(filePath);
                this.log.verbose('renaming', filePath, resolve(opts.to, fileName))
                // if(i>10) this.cli.fail()
                renameSync(filePath, resolve(opts.to, fileName));
            });
        })


    }
}
