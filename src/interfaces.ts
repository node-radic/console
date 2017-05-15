

import { KindOf } from "@radic/util";
export interface ICli {

}


export interface CommandConfig {
    name?: string
    usage?: string | null
    description?: string
    subCommands?: string[]
    cls?: Function
    filePath?:string
    action?:Function|string
    argv?:string[]
    args?:string[]
}

export interface OptionConfig {
    transformer?: Function;
    arguments?: number;
    count?: boolean;
    description?: any;
    default?:any
    key?: string
    name?: string
    type?: KindOf
    array?: boolean
    cls?: Object
}