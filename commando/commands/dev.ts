import * as lodash from "lodash";
import { Group, group, Command, command, inject, injectable } from "../../src";
import { COMMANDO, config } from "../core";
import { ConnectionRepository } from "../services/connection";

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

        this.in.ask('Do you want to save these connections?', { type: 'confirm' }).then((answer: boolean) => {
            if ( answer === true ) {
                this.log.info('Saving connections');
                this.cons.forEach((con) => {
                    this.log.debug('Connection ' + con.name + ': saving', con);
                    this.connections.model(con).save()
                    this.log.debug('Connection ' + con.name + ': saved', con);
                })

                return this.log.info('Connections saved')
            }
            this.log.warn('Canceled operation')
        })
    }

    cons: any[] = []

    con(name, remote, key = 'radic', opts: any = {}) {
        opts = lodash.merge({
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
