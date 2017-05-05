namespace Consul {
    export interface ParseResult {
        options?: any
        arguments?:any

        opt(name: string): any
        arg(name: string): any
        hasOpt(name: string): any
        hasArg(name: string): any
    }
    export class Cli {
        parse: (...args: any[]) => ParseResult
    }

}


const cli = new Consul.Cli();

cli.parse();