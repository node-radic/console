import { command } from "../../../../src/decorators";
import { YarnGroup } from "./yarn";
import { inject } from "../../../../src/core/ioc";
import Output from "../../../../src/helpers/Output";

@command('install', {
    group: YarnGroup,
    options: {
        g: { alias: 'global', desc: 'Install packages globally'}  // by default, type will be 'boolean'
    },
    arguments: {
        packages: { desc: 'One or more packages to install', required: false, type: 'array', default: [] }
    }
})
export class YarnInstallCommand {
    // options
    g:boolean
    // or
    global:boolean

    // arguments
    packages:string[];

    // DI
    @inject('console.helpers.output') out:Output

    handle(){

        if(this.packages.length > 0){
            this.installPackages(this.packages);
        } else {
            const pkg = require('./package.json')
            const packages = Object.keys(pkg.dependencies).map((name) => {
                return name + '@' + pkg.dependencies[name]
            })
            this.installPackages(packages);
        }
        this.out.line(`packages: ${this.packages.join(', ')}`);

        if(this.global) this.out.success('global');
    }

    installPackages(packages:string[]){

        if(this.global){
            //...
        }

        // ...
    }
}