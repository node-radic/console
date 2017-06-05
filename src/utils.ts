import { YargsParserOptions } from "../types/yargs-parser";
import { OptionConfig } from "./interfaces";
const callsites = require('callsites');

export function dumpCallsites(){

    let sites = callsites();
    for(let i=0; i<sites.length; i++){
        console.log(i, 'getTypeName', sites[i].getTypeName())
        console.log(i, 'getFileName', sites[i].getFileName())
        console.log(i, 'getFunctionName', sites[i].getFunctionName())
        console.log(i, 'getMethodName', sites[i].getMethodName())
        console.log(i, 'getFileName', sites[i].getFileName())
        console.log(i, 'getLineNumber', sites[i].getLineNumber())
        console.log(i, 'getColumnNumber', sites[i].getColumnNumber())
        console.log(i, 'getEvalOrigin', sites[i].getEvalOrigin())
        console.log(i, 'isToplevel', sites[i].isToplevel())
        console.log(i, 'isEval', sites[i].isEval())
        console.log(i, 'isNative', sites[i].isNative())
        console.log(i, 'isConstructor', sites[i].isConstructor())
    }
}



/** transforms my option structure to the yargs-parser option structure */
export function transformOptions(configs: OptionConfig[]): YargsParserOptions {
    let options: YargsParserOptions = {
        array        : [],
        boolean      : [],
        string       : [],
        number       : [],
        count        : [],
        // config?: boolean
        coerce       : {},
        alias        : {},
        default      : {},
        narg         : {},
        normalize    : true,
        configuration: {
            'short-option-groups'      : true,
            'camel-case-expansion'     : true,
            'dot-notation'             : true,
            'parse-numbers'            : true,
            'boolean-negation'         : true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays' : true,
        }
    };
    configs.forEach((config: OptionConfig, iconfig: number) => {
        let key  = config.key;
        let type = config.type || 'boolean';

        options.alias[ key ] = [ config.name ];

        if ( config.count ) {
            options.count.push(key)
            type = undefined
        }

        if ( config.array === true ) options.array.push(key);
        if ( config.transformer ) options.coerce[ key ] = config.transformer;
        if ( config.arguments ) options.narg[ key ] = config.arguments;
        if ( config.default ) options.default[ key ] = config.default

        if ( type !== undefined ) {
            options[ type ].push(key);
            configs[ iconfig ][ 'type' ] = type;
        }
    })
    return options;
}

