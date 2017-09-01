var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { helper } from "../decorators";
import { inject } from "../core/Container";
import { logLevels } from "../core/Log";
var VerbosityHelper = /** @class */ (function () {
    function VerbosityHelper() {
    }
    VerbosityHelper.prototype.onExecuteCommandParse = function (event) {
        event.cli.global(this.config.option.key, {
            name: this.config.option.name,
            count: true,
            // tyhpe
            description: 'increase verbosity (1:verbose|2:data|3:debug|4:silly)'
        });
    };
    VerbosityHelper.prototype.onExecuteCommandParsed = function (event) {
        if (event.argv[this.config.option.key]) {
            var level = parseInt(event.argv[this.config.option.key]);
            level = logLevels.indexOf('info') + level;
            if (level > logLevels.length - 1) {
                level = logLevels.length - 1;
            }
            var levelName = logLevels[level];
            this.log.level = levelName;
            this.log.verbose("Verbosity set (" + level + " : " + levelName + " : " + this.log.level + ")");
        }
    };
    __decorate([
        inject('cli.log'),
        __metadata("design:type", Object)
    ], VerbosityHelper.prototype, "log", void 0);
    VerbosityHelper = __decorate([
        helper('verbose', {
            singleton: true,
            config: {
                option: {
                    enabled: true,
                    key: 'v',
                    name: 'verbose'
                }
            },
            listeners: {
                'cli:parsed': 'onExecuteCommandParsed',
                'cli:execute:parse': 'onExecuteCommandParse',
                'cli:execute:parsed': 'onExecuteCommandParsed'
            }
        })
    ], VerbosityHelper);
    return VerbosityHelper;
}());
export { VerbosityHelper };
