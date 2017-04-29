import { command, Describer, inject, Input, interfaces as i, option, Output, ParsedNode } from "../../../../src";
import { YarnGroup } from "./yarn";
import { IConfigProperty } from "@radic/util";

@command('install', {
    group    : YarnGroup,
    options  : {
        g: { alias: 'global', desc: 'Install packages globally' }  // by default, type will be 'boolean'
    },
    arguments: {
        packages: { desc: 'One or more packages to install', required: false, type: 'array', default: [] }
    }
})
export class YarnInstallCommand {
    // options
    g: boolean
    // or

    @option('A glob boolean = false', 'g')
    global: boolean = false;

    @option('A man string', 'm')
    man: string;

    @option('A foo number = 5', 'f')
    foo: number = 5;


    @option('Array of booleans', Boolean, 'b')
    arbool: boolean[];

    @option('Array of string', String, 's')
    arstr: string[];

    @option('Array of number', Number, 'n')
    arnr: number[];

    // arguments
    packages: string[];

    parsed: ParsedNode<i.CommandNodeConfig>;

    // DI
    @inject('console.helpers.output') out: Output

    @inject('console.helpers.input') in: Input

    @inject('console.helpers.describer') desc: Describer

    @inject('console.config') config: IConfigProperty;

    handle() {
        let desc = this.desc.command(this.parsed)
        // this.out.dumpp(desc)

        // this.out.success('ok');

        // this.in.ask('hello??').then((answer) => {
        //     this.out.dump(answer);
        // })
    }

    dumpStuff() {

        // this.out.line(`packages: ${this.packages.join(', ')}`);
        this.out.line('{green}THIS:{reset}')
        this.out.dump(this);

        this.out.line('{green}CONFIG:{reset}')
        this.out.dump(this.config.get('helpers.input'))

        this.out.line('{green}THIS.in:{reset}')
        this.out.dump(this.in);
        if ( this.global ) this.out.success('global');
    }
}