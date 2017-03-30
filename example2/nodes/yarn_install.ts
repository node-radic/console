import { command } from "../../src/decorators";
import { YarnGroup } from "./yarn";

@command('install', {
    group: YarnGroup,
    options: {
        g: { alias: 'global', desc: 'Install packages globally'}  // by default, type will be 'boolean'
    },
    arguments: {
        packages: { desc: 'One or more packages to install', required: false, type: 'array' }
    }
})
export class YarnInstallCommand {
    g:boolean
    global:boolean

    packages:string[]

    handle(){

    }
}