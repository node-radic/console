import { Kernel, interfaces as inversifyInterfaces } from "inversify";
import { CommandsCli, ArgumentsCli } from "./cli";
import { IOptionsDefinitionParser } from "../definitions";
export declare class App extends Kernel {
    build<T>(cls: any): T;
    make<T>(cls: any): T;
    protected ensureInjectable(cls: Function): void;
    Cli<CLS, DEF, DEFPARSER extends IOptionsDefinitionParser>(cls: any, def: any, defparser: any): CLS;
    commandsCli(): CommandsCli;
    argumentsCli(): ArgumentsCli;
    bindKernel(kernel: App): void;
    private bindParserFactory<T2>(binding, parserBinding);
}
export declare let app: App;
declare let provide: (serviceIdentifier: string | symbol | inversifyInterfaces.Newable<any> | inversifyInterfaces.Abstract<any>) => (target: any) => any;
declare let provideSingleton: (identifier: any) => any;
export { provide, lazyInject, provideSingleton };
