import * as _ from "lodash";
import { Group, group, Command, command, inject, injectable } from "../../src";
import { COMMANDO, config } from "../core";
import { ConnectionRepository } from "../services/connection";
import { spawn } from 'child_process'
import { Server, Client } from "../services/udp";
import { createSocket, Socket, AddressInfo } from 'dgram';
import { paths } from "../core/paths";
import { resolve } from 'path';
import { ensureFileSync, appendFileSync, readFileSync } from 'fs-extra'
import * as moment from 'moment';


@group('dev', 'Dev/Debug Commands', 'Extra commands for debugging and development purposes')
export class DevGroup extends Group {

    fire() {
        if ( config('debug') !== true ) {
            this.fail('Requires debug mode')
        }
        super.fire()
    }
}

@injectable()
export class DevCommand extends Command {

    fire() {
        if ( config('debug') !== true ) {
            this.fail('Requires debug mode')
        }
        super.fire()
    }
}

@command('paths', 'Show paths', 'paths', DevGroup)
export class PathsDevCommand extends DevCommand {
    @inject(COMMANDO.PATHS)
    paths: any;

    handle() {
        let table = this.out.columns() //['key', 'value'])
        Object.keys(this.paths).forEach(name => table.push([name, this.paths[name]);
        this.line(table.toString());
    }
}

@command('serve', 'Test udp server', 'Test udp server', DevGroup)
export class ServeDevCommand extends DevCommand {
    @inject(COMMANDO.DGRAM_SERVER)
    server: Server


    handle() {
        this.server.start();
    }
}

@command('client', 'Test udp client', 'Test udp client', DevGroup)
export class ClientDevCommand extends DevCommand {
    @inject(COMMANDO.DGRAM_CLIENT)
    client: Client


    handle() {
        this.client.connect();
    }
}

@command('con', 'Connections Seeder', 'Add working connections for testing for all remotes.', DevGroup)
export class ConDevCommand extends DevCommand {
    // options: {
    //     g: {alias:'green', desc: 'Show green instead of yellow'}
    // }
    @inject(COMMANDO.CONNECTIONS)
    connections: ConnectionRepository

    handle() {
        this.con('projects', 'jira', 'radic', { extra: { url: 'https://projects.radic.nl' } })
        this.con('gh', 'github', 'robinradic')
        this.con('bb', 'bitbucket', 'robinradic')
        this.con('bbs', 'bitbucket_server', 'radic', { extra: { url: 'https://git.radic.nl' } })

        this.out.dump(this.cons);
        this.in.askSecret('Password to use').then((secret: string) =>
            this.in.ask('Do you want to save these connections?', { type: 'confirm' }).then((answer: boolean) => {
                if ( answer === true ) {
                    this.log.info('Saving connections');
                    this.cons.forEach((con) => {
                        con.secret = secret;
                        this.log.verbose('Connection ' + con.name + ': saving', con);
                        this.connections.model(con).save()
                        this.log.verbose('Connection ' + con.name + ': saved', con);
                    })

                    return this.log.info('Connections saved')
                }
                this.log.warn('Canceled operation')
            })
        )
    }

    cons: any[] = []

    con(name, remote, key = 'radic', opts: any = {}) {
        opts        = _.merge({
            name, remote, key,
            method: 'basic',
            secret: null,
            extra : {}
        }, opts);
        opts.secret = opts.secret || config('env.radic.password')
        this.cons.push(opts)
    }

    add(con) {

    }
}


//--remote-debugging-port=9222


@command('chromium', 'Chromium Remote Debugging', 'Start your host Chrome instance with the remote-debugging-port command line switch.', DevGroup)
export class ChromiumRemoteDebugDevCommand extends DevCommand {
    handle() {
        const browser = spawn('chromium-browser', [ '--remote-debugging-port=9222' ], {
            detached: true,
            stdio   : process.stdin
        })
    }
}


@command('dop', 'dop command', 'dopper de dop', DevGroup)
export class DopDevCommand extends DevCommand {
    options = {
        serve        : { alias: 's', default: false },
        host         : { alias: 'h', default: '10.0.0.81', type: 'string' },
        port         : { alias: 'p', default: 44411, type: 'number' },
        'client-port': { alias: 'c', default: 44422, type: 'number' },
        logpath      : { alias: 'L', default: () => resolve(paths.user, '.server-doplog'), type: 'string' },
        log          : { alias: 'l', default: false }
    }

    arguments = {
        amount: { type: 'string' }
    }

    handle() {
        if ( this.opt('serve') ) {
            return this.serve();
        }
        this.client();
    }

    protected serve() {
        let sock = createSocket('udp4');
        sock.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            sock.close();
        })

        let logPath = this.opt('logpath');
        sock.on('message', (msg, rinfo) => {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
            ensureFileSync(logPath)
            msg = msg.toString();
            if ( msg.toString().trim() === 'log' ) {
                sock.send(readFileSync(logPath), rinfo.port, rinfo.address);
            } else {
                appendFileSync(logPath, '\n' + moment().format('hh:mm') + ' = ' + msg);
            }

        });

        sock.on('listening', () => {
            var net = sock.address();
            console.log(`server listening ${net.address}:${net.port}`);
        });

        sock.bind({ port: this.opt('port'), address: this.opt('host') });
    }

    protected createPackage(): Package {
        return new Package(this.opt('port'), this.opt('host'));
    }

    protected client(): void {
        if ( this.opt('log') ) {
            return this.showLog();
        }
        this.askArg('amount', 'amount').then((answer: string) => {
            this.doLog(answer);
        })

    }

    protected doLog(msg: string) {
        this.createPackage().setData(msg).send().catch((err) => this.onError(err)).then((pkg: Package) => {
            console.log('Dop logged');
        })
    }

    protected showLog() {
        this.createPackage()
            .setData('log')
            .returnsData()
            .send()
            .catch(this.onError)
            .then((pkg: Package) => {
                this.out.writeln('{header}Doplog{/header}')
                this.out.writeln(pkg.result);
            })
    }

    public onError(err) {
        console.log('error ', err);
        throw err;
    }
}

class Package {
    public sock: Socket;
    public port: number       = 44422;
    public listening: boolean = false;
    public closed: boolean    = false;
    public done: boolean      = false;
    public result: any        = undefined;
    public error: any         = undefined;
    public listen: boolean    = false;


    constructor(protected serverPort: number, protected serverHost: string, protected data: string = '') {}

    public static create(sPort: number, sHost: string) { return new Package(sPort, sHost); }

    public setData(data: string): this {
        this.data = data;
        return this;
    }

    public returnsData(): this {
        this.listen = true;
        return this;
    }

    public send(): Promise<this> {
        this.createSocket();
        if ( this.listen ) {
            this.listenToServer();
        }
        return new Promise((resolve, reject) => {
            this.sendToServer(this.data, () => {
                if ( this.error ) return reject(this.error)
                resolve(this);
            });
        })
    }

    protected createSocket() {
        this.sock = createSocket('udp4')
        this.sock.on('close', () => {
            this.listening = false;
            this.closed    = true;
        })

        this.sock.on('listening', () => {
            this.listening = true;
            const ai       = this.sock.address();
            // console.log(`client listening ${ai.address}:${ai.port}`);
        });

        this.sock.on('error', () => this.onError());
    }

    protected listenToServer() {
        this.sock.on('message', (msg, rinfo) => {
            // console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
            this.listenHandler.apply(this, [ msg, rinfo ]);

        });
        this.sock.bind({ port: this.port, address: '0.0.0.0' });

    }

    listenHandler: (msg: string, rinfo: AddressInfo) => void = (msg: any, rinfo: any) => {}

    protected sendToServer(request: string, cb?: Function) {
        this.sock.send(this.data, this.serverPort, this.serverHost, (err) => {
            if ( err ) {
                this.error = err
                cb(this);
                return this.onError(err);
            }

            if ( this.listen ) {
                return this.listenHandler = (msg: string, rinfo: AddressInfo) => {
                    this.result = msg;
                    cb(this);
                }
            }

            this.sock.close();
            cb(this);
        })
    }

    protected onError(err?: any) {
        this.sock.close();
        console.log('error');
        // if ( err ) throw err;
    }


}

class Request {
    params: any[];

    constructor(public command: string, ...params: any[]) {
        this.params = params;
    }

    toJson() {
        let data = {
            command: this.command,
            params : this.params.map((param) => param.toString())
        }
        return JSON.stringify(data);
    }

    toString() {
        return this.toJson();
    }

    static fromJson(json: string) {
        let data = JSON.parse(json);
        return new Request(data.command, data.params);
    }
}
