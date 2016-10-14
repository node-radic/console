import * as util from "@radic/util";


let defaults               = {
    app: {
        title      : undefined,
        description: undefined,
        version    : undefined,
    },
    colors    : {
        enabled    : true,
        title      : 'green bold',
        subtitle   : 'yellow',

        header     : 'darkorange bold',
        group      : 'steelblue bold',
        command    : 'skyblue',
        description: 'grey',
        argument   : 'yellow darken 50'
        //etc
    },
    descriptor: {
        cli: {
            showTitle  : true,
            showVersion: true,
            showDescription: true,
        },
        text: {
            commands: 'Commands',
            options: 'Options',
            globalOptions: 'Global Options'
        }
    }
}

export interface IBaseConfig extends util.IConfig
{
    title(val: string): this
    description(val: string): this
    version(val: string): this
    dump()
}

export interface IConfig extends IBaseConfig
{
    (args?: any): any;
}

export class Config extends util.Config implements IBaseConfig
{


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

    dump() {
        console.dir(this.data, { colors: true, showHidden: true });
    }


    public static makeProperty(config: IBaseConfig): IConfig {
        var cf: any = function (prop?: any): any {
            return config.get(prop);
        };

        cf.title   = config.title.bind(config);
        cf.version = config.version.bind(config);
        cf.get     = config.get.bind(config);
        cf.set     = config.set.bind(config);
        cf.unset   = config.unset.bind(config);
        cf.merge   = config.merge.bind(config);
        cf.raw     = config.raw.bind(config);
        cf.process = config.process.bind(config);
        cf.has     = config.has.bind(config);
        cf.dump    = config.dump.bind(config)

        return cf;
    }

}
let _config: IBaseConfig   = new Config(defaults);
export let config: IConfig = Config.makeProperty(_config)
