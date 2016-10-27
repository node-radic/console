import * as util from "@radic/util";


let defaults = {
    app       : {
        title      : undefined,
        description: undefined,
        version    : undefined,
    },
    styles: {
        title   : 'yellow bold',
        subtitle: 'yellow',

        success    : 'green lighten 20 bold',
        header     : 'darkorange bold',
        group      : 'steelblue bold',
        command    : 'darkcyan',
        description: 'darkslategray',
        argument   : 'yellow darken 25'
    },
    colors    : {
        enabled : true,
        title   : 'yellow bold',
        subtitle: 'yellow',

        success    : 'green lighten 20 bold',
        header     : 'darkorange bold',
        group      : 'steelblue bold',
        command    : 'slateblue',
        description: 'darkslategray',
        argument   : 'yellow darken 25'
        //etc
    },
    help      : {
        enabled: false,
        key    : undefined,
        command: undefined
    },
    descriptor: {
        cli    : {
            showTitle        : true,
            showVersion      : true,
            showDescription  : true,
            showHelpAsDefault: true // When no args/opts are provided, should i display the help?
        },
        group  : {
            showHelpAsDefault: true // When no args/opts are provided, should i display the help?
        },
        command: {
            showHelpAsDefault: false // When no args/opts are provided, should i display the help?
        },
        text   : {
            commands     : 'Commands & Groups',
            options      : 'Options',
            arguments    : 'Arguments',
            globalOptions: 'Global Options',
            usage: 'Usage',
            example: 'Example'
        }
    }
}

export interface IBaseConfig extends util.IConfig {
    title(val: string): this
    description(val: string): this
    version(val: string): this
    help(key: string, command?: string): this
    dump()
}

export interface IConfig extends IBaseConfig {
    (args?: any): any;
}

export class Config extends util.Config implements IBaseConfig {


    title(title: string): this {
        this.set('app.title', title);
        return this;
    }

    version(title: string): this {
        this.set('app.version', title);
        return this;
    }

    description(title: string): this {
        this.set('app.description', title);
        return this;
    }

    help(key: string, command?: string): this {
        this.merge('help', {
            enabled: true,
            key    : key,
            command: command
        })
        return this
    }

    dump() {
        console.dir(this.data, { colors: true, showHidden: true });
    }


    public get(prop?: any, def?: any): any {
        return super.get(prop, def);
    }

    public static makeProperty(config: IBaseConfig): IConfig {
        var cf: any = function (prop?: any): any {
            return config.get(prop);
        };

        cf.title        = config.title.bind(config);
        cf.version      = config.version.bind(config);
        cf.get          = config.get.bind(config);
        cf.set          = config.set.bind(config);
        cf.unset        = config.unset.bind(config);
        cf.mergeOptions = config.merge.bind(config);
        cf.raw          = config.raw.bind(config);
        cf.process      = config.process.bind(config);
        cf.has          = config.has.bind(config);
        cf.dump         = config.dump.bind(config)

        return cf;
    }

}
let _config: IBaseConfig   = new Config(defaults);
export let config: IConfig = Config.makeProperty(_config)
