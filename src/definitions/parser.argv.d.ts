export interface IArgvParserOptions extends YargsParserOptions {
    nested: string[];
    desc: {
        [key: string]: string;
    };
    handler: {
        [key: string]: Function;
    };
}
export interface IParsedArgv extends YargsParserDetailed {
    argv?: {
        _?: any[];
        [key: string]: any;
    };
}
export declare function parseArgv(argv: any[], options?: any): IParsedArgv;
