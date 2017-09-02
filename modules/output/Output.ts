import { IOutput, IOutputUtil, OutputOptions, TreeData, TreeOptions } from "./interfaces";
import { inspect, InspectOptions } from 'util';
import { requirePeer, singleton, Diff } from "../../src";
import { OutputUtil } from './OutputUtil'

@singleton('cli.output')
export class Output implements IOutput {
    public util: IOutputUtil;
    public stdout: NodeJS.WriteStream = process.stdout
    protected macros: { [name: string]: (...args: any[]) => string }
    protected _options: OutputOptions = {
        enabled: true,
        colors : true,
        inspect: { showHidden: true, depth: 10 }
    }

    get options(): OutputOptions { return this._options}

    get nl(): this { return this.write('\n') }

    constructor() { this.util = new OutputUtil(this); }

    write(text: string): this {
        this.stdout.write(text);
        return this;
    }

    writeln = (text: string = ''): this => this.write(text + '\n')

    line = (text: string = ''): this => this.write(text + '\n')

    dump = (...args: any[]): this => {
        this._options.inspect.colors = this._options.colors
        args.forEach(arg => this.line(inspect(arg, this._options.inspect)));
        return this
    }

    macro<T extends (...args: any[]) => string>(name: string): T {
        return <T> ((...args: any[]): string => {
            return this.macros[ name ].apply(this, args)
        })
    }

    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any {
        this.macros[ name ] = macro;
        return this
    }

    diff = (o: object, o2: object): Diff => new Diff(o, o2)

    spinner = (text?: string): ora.Ora => requirePeer<ora.Ora>('ora')

    spinners: any[];

    beep(val?: number, cb?: Function): this {
        requirePeer<Function>('beeper')(val)
        return this
    }

    tree(obj: TreeData, prefix?: string, opts?: TreeOptions) : this{
        let tree = requirePeer('archy')(obj, prefix, opts);
        return this.line(tree);
    }
}