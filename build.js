"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var globule = require("globule");
var inquirer = require("inquirer");
var cp = require("child_process");
var util_1 = require("util");
var util_2 = require("@radic/util");
var config = {
    outDir: 'lib',
    docDir: 'docs',
    srcDir: 'src'
};
var dump = function (obj) { return console.log(util_1.inspect(obj, true, 5, true)); };
var exec = function (cmd) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args = cmd.split(' ').slice(1).concat(args);
    cmd = cmd.split(' ').shift();
    console.log(cmd, args);
    var _a = cp.spawnSync(cmd, args), stdout = _a.stdout, stderr = _a.stderr;
    var out = '';
    if (stdout)
        out += stdout.toString();
    if (stderr)
        out += stderr.toString();
    return out;
};
var rm = function (paths) {
    paths = util_2.kindOf(paths) === 'string' ? [paths.toString()] : paths;
    paths.forEach(function (path) { return globule.find(path).forEach(function (filePath) { return fs.removeSync(filePath) && console.log('Removed', filePath); }); });
};
var Tasks = (function () {
    function Tasks() {
    }
    Tasks.start = function (name) {
        if (name in this.completed)
            return false;
        console.log(name, ' started');
        return true;
    };
    Tasks.done = function (name) {
        this.completed.push(name);
        console.log(name, ' done');
    };
    Tasks.clean = function () {
        if (!Tasks.start('clean'))
            return;
        var paths = [
            config.srcDir + "/**/*.{js,js.map,d.ts}",
        ];
        paths.forEach(function (path) { return globule.find(path).forEach(function (filePath) {
            fs.removeSync(filePath);
            console.log('Clean up', filePath);
        }); });
        Tasks.done('clean');
    };
    Tasks.build = function () {
        if (!Tasks.start('build'))
            return;
        Tasks.clean();
        Tasks.docs();
        console.log(exec('node_modules/.bin/tsc'));
        Tasks.done('build');
    };
    Tasks.docs = function () {
        if (!Tasks.start('docs'))
            return;
        console.log(exec('node_modules/.bin/typedoc --includeDeclarations --target ES6 --exclude node_modules --exclude types/lodash --ignoreCompilerErrors --mode file --excludeExternals --excludePrivate --out', config.docDir, './lib/index.d.ts'));
        Tasks.done('docs');
    };
    return Tasks;
}());
Tasks.completed = [];
function doTasks(tasks) {
    tasks.forEach(function (task) {
        Tasks[task]();
    });
}
function askTasks() {
    return inquirer.prompt([
        { name: 'tasks', type: 'checkbox', message: 'Select task(s)', choices: ['clean', 'build'] }
    ]);
}
var tasks = process.argv.splice(2);
if (tasks.length) {
    doTasks(tasks);
}
else {
    askTasks().then(function (answers) {
        doTasks(answers.tasks);
    });
}
