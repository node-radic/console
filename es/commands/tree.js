var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { container, inject, injectable } from "../core/Container";
import { OutputHelper } from "../helpers/helper.output";
import { Cli } from "../core/Cli";
var TreeCmd = /** @class */ (function () {
    function TreeCmd() {
        this.desc = false;
        this.opts = false;
        this.all = false;
        this.colors = {
            group: 'darkcyan bold',
            command: 'steelblue',
            description: 'darkslategray',
            argument: 'green',
            requiredArgument: 'yellow',
            option: 'darkslategray lighten 40'
        };
    }
    Object.defineProperty(TreeCmd.prototype, "getSubCommands", {
        get: function () { return container.get('cli.fn.commands.get'); },
        enumerable: true,
        configurable: true
    });
    TreeCmd.prototype.printTree = function (label, config) {
        if (this.all) {
            this.desc = this.opts = true;
        }
        this.out.tree(label, this.getChildren(config));
    };
    TreeCmd.prototype.getChildren = function (config) {
        var _this = this;
        return this.getSubCommands(config.filePath, false, true)
            .filter(function (command) { return command.isGroup; })
            .concat(this.getSubCommands(config.filePath, false, true).filter(function (command) { return !command.isGroup; }))
            .map(function (command) {
            if (command.isGroup) {
                var label = "{" + _this.colors.group + "}" + command.name + "{reset}";
                if (_this.desc && command.description.length > 0) {
                    label += " : {" + _this.colors.description + "}" + command.description + "{reset}";
                }
                return { label: label, nodes: _this.getChildren(command) };
            }
            return _this.getChild(command);
        });
    };
    TreeCmd.prototype.getChild = function (config) {
        var _this = this;
        var types = {
            integer: '#8ACCCF',
            boolean: '#EFEFAF',
            string: '#CC9393'
        };
        var args = config.arguments.map(function (arg) {
            var output = [];
            var name = arg.name;
            output.push(arg.required ? "<{" + _this.colors.requiredArgument + "}" + arg.name + "{reset}" : "[{" + _this.colors.argument + "}" + arg.name + "{reset}");
            // if(arg.type && types[arg.type] ){
            //     output.push(`({${types[arg.type]}}${arg.type}{/${types[arg.type]}})`);
            // }
            if (_this.desc && _this.desc) {
                output.push(":{" + _this.colors.description + "}" + arg.description + "{reset}");
            }
            output.push(arg.required ? '>' : ']');
            return output.join('');
        }).join(' ');
        var name = "{" + this.colors.command + "}" + config.name + "{reset}";
        var opts = '';
        if (this.opts && config.options && config.options.length > 0) {
            opts = config.options.map(function (opt) { return '--' + opt.name; }).join(' ');
        }
        return name + " " + args + " {" + this.colors.option + "}" + opts + "{reset}";
    };
    __decorate([
        inject('cli.helpers.output'),
        __metadata("design:type", OutputHelper)
    ], TreeCmd.prototype, "out", void 0);
    __decorate([
        inject('cli'),
        __metadata("design:type", Cli)
    ], TreeCmd.prototype, "cli", void 0);
    __decorate([
        inject('cli.config'),
        __metadata("design:type", Function)
    ], TreeCmd.prototype, "config", void 0);
    TreeCmd = __decorate([
        injectable()
    ], TreeCmd);
    return TreeCmd;
}());
export { TreeCmd };
