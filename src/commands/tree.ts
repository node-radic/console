import { container, inject, injectable } from "../core/Container";
import { Config } from "../core/config";
import { OutputHelper } from "../helpers/helper.output";
import { SubCommandsGetFunction } from "../utils";
import { Cli } from "../core/Cli";
import { CommandConfig } from "../interfaces";

@injectable()
export class TreeCmd {

    @inject('cli.helpers.output')
    out: OutputHelper;

    @inject('cli')
    cli: Cli;

    @inject('cli.config')
    config: Config;

    desc: boolean = false

    opts: boolean = false

    all: boolean = false

    colors = {
        group: 'darkcyan bold',
        command: 'steelblue',
        description: 'darkslategray',
        argument: 'green',
        requiredArgument: 'yellow',
        option: 'darkslategray lighten 40'
    }

    public get getSubCommands(): SubCommandsGetFunction { return container.get<SubCommandsGetFunction>('cli.fn.commands.get') }


    protected printTree(label: string, config: CommandConfig) {
        if ( this.all ) {
            this.desc = this.opts = true;
        }
        this.out.tree(label, this.getChildren(config))
    }

    protected getChildren(config: CommandConfig) {
        return this.getSubCommands<CommandConfig[]>(config.filePath, false, true)
            .filter(command => command.isGroup)
            .concat(this.getSubCommands<CommandConfig[]>(config.filePath, false, true).filter(command => ! command.isGroup))
            .map(command => {
                if ( command.isGroup ) {
                    let label = `{${this.colors.group}}${command.name}{reset}`;
                    if(this.desc && command.description.length > 0){
                        label += ` : {${this.colors.description}}${command.description}{reset}`
                    }
                    return { label, nodes: this.getChildren(command) }
                }
                return this.getChild(command)
            })

    }

    protected getChild(config: CommandConfig) {
        let types = {
            integer: '#8ACCCF',
            boolean: '#EFEFAF',
            string : '#CC9393'
        }
        let args  = config.arguments.map(arg => {
            let output = [];
            let name   = arg.name;
            output.push(arg.required ? `<{${this.colors.requiredArgument}}${arg.name}{reset}` : `[{${this.colors.argument}}${arg.name}{reset}`);
            // if(arg.type && types[arg.type] ){
            //     output.push(`({${types[arg.type]}}${arg.type}{/${types[arg.type]}})`);
            // }
            if ( this.desc && this.desc ) {
                output.push(`:{${this.colors.description}}${arg.description}{reset}`)
            }
            output.push(arg.required ? '>' : ']')
            return output.join('')

        }).join(' ');
        let name  = `{${this.colors.command}}${config.name}{reset}`
        let opts  = '';
        if ( this.opts && config.options && config.options.length > 0 ) {
            opts = config.options.map(opt => '--' + opt.name).join(' ')
        }

        return `${name} ${args} {${this.colors.option}}${opts}{reset}`;
    }
}