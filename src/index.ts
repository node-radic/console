import "reflect-metadata";
import { CommandConfig } from "./interfaces";
export {LoggerInstance} from 'winston'
// import {} from './utils'
export * from './interfaces'
export * from './core/index'
require('./utils') // ensures utils are bound into container.. @todo fix properly
export * from './utils'
export * from './decorators'
export * from './helpers/index'

export * from './defaults'
















namespace loader {
    process.argv;
    interface CommandFinderStrategy {
        /**
         * @throws Error
         * @param args
         */
        find(query:string) : CommandConfig;
    }

    class CommandDecoratorStrategy implements CommandFinderStrategy {
        public find(query: string): CommandConfig {
            return undefined;
        }
    }

    class CommandInlineStrategy implements CommandFinderStrategy {
        public find(query: string): CommandConfig {
            return undefined;
        }
    }

    class CommandFinder {

        constructor(protected strategy:CommandFinderStrategy){}

        find(query:string) : CommandConfig {
            return this.strategy.find(query)
        }
    }


    function bootstrapInline(){

    }

    function bootstrapDecorator(){
        const finder = new CommandFinder(new CommandDecoratorStrategy());
        finder.find('git repo create')
    }
}