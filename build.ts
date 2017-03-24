import * as fs from 'fs-extra'
import * as globule from 'globule'
import * as inquirer from 'inquirer'
import * as cp from 'child_process'
import { inspect } from "util";
import { kindOf } from "@radic/util";


const config: any = {
    outDir: 'lib',
    docDir: 'docs',
    srcDir: 'src'
}
const dump        = (obj: any) => console.log(inspect(obj, true, 5, true));
const exec        = (cmd: string, ...args: string[]) => {
    args = cmd.split(' ').slice(1).concat(args);
    cmd = cmd.split(' ').shift();
    console.log(cmd, args)
    let { stdout, stderr } = cp.spawnSync(cmd, args);
    let out                = '';
    if ( stdout ) out += stdout.toString()
    if ( stderr ) out += stderr.toString()
    return out;
};
const rm          = (paths: string|string[]) => {
    paths = kindOf(paths) === 'string' ? [ paths.toString() ] : paths;
    (<string[]> paths).forEach(path => globule.find(path).forEach(filePath => fs.removeSync(filePath) && console.log('Removed', filePath)))
}

class Tasks {
    private static completed: string[] = [];

    private static start(name: string): boolean {
        if ( name in this.completed ) return false;
        console.log(name, ' started');
        return true;
    }

    private static done(name: string) {
        this.completed.push(name)
        console.log(name, ' done');
    }

    static clean() {
        if ( ! Tasks.start('clean') ) return;
        const paths = [
            `${config.srcDir}/**/*.\{js,js.map,d.ts}`,
            // `${config.outDir}/**`
        ];
        paths.forEach(path => globule.find(path).forEach(filePath => {
            fs.removeSync(filePath);
            console.log('Clean up', filePath)
        }));
        Tasks.done('clean')
    }

    static build() {
        if ( ! Tasks.start('build') ) return;
        Tasks.clean();
        Tasks.docs();
        console.log(exec('node_modules/.bin/tsc'));
        Tasks.done('build')
    }

    static docs() {
        if ( ! Tasks.start('docs') ) return;
        console.log(exec('node_modules/.bin/typedoc --includeDeclarations --target ES6 --exclude node_modules --exclude types/lodash --ignoreCompilerErrors --mode file --excludeExternals --excludePrivate --out', config.docDir, './lib/index.d.ts'));
        Tasks.done('docs')
    }
}


function doTasks(tasks: string[]) {
    tasks.forEach(task => {
        Tasks[ task ]();
    })
}
function askTasks(): Promise<inquirer.Answers> {
    return inquirer.prompt([
        <inquirer.Question> { name: 'tasks', type: 'checkbox', message: 'Select task(s)', choices: [ 'clean', 'build' ] }
    ])
}


let tasks = process.argv.splice(2);
if ( tasks.length ) {
    doTasks(tasks);
} else {
    askTasks().then((answers: any) => {
        doTasks(answers.tasks)
    })
}

