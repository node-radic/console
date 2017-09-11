var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mocha-typescript", "../src", "./_support/bootstrap", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mocha_typescript_1 = require("mocha-typescript");
    var src_1 = require("../src");
    var bootstrap_1 = require("./_support/bootstrap");
    var chai_1 = require("chai");
    var parseArguments = src_1.container.get('cli.fn.arguments.parse');
    var prepareArguments = src_1.container.get('cli.fn.arguments.prepare');
    var CommandArguments = /** @class */ (function () {
        function CommandArguments() {
        }
        CommandArguments.before = function () {
            var helpers = {};
            var config = {};
            this.cli = bootstrap_1.bootstrap(helpers, config);
        };
        CommandArguments.prototype.before = function () {
            function Cmd() { }
            this.config = src_1.defaults.command(Cmd);
        };
        CommandArguments.prototype.prepare = function (argDef, cmdName) {
            if (cmdName === void 0) { cmdName = 'testcmd'; }
            var config = prepareArguments(__assign({}, this.config, { name: cmdName + "\n" + argDef }));
            return config;
        };
        CommandArguments.prototype.testPrepareNameAndAlias = function () {
            var _a = this.prepare('', 'foobar|foo'), name = _a.name, alias = _a.alias;
            name.should.eq('foobar');
            alias.should.eq('foo');
        };
        CommandArguments.prototype.testPrepareNameAndSameAlias = function () {
            var _a = this.prepare('', 'foobar|foobar'), name = _a.name, alias = _a.alias;
            name.should.eq('foobar');
            alias.should.eq(null);
        };
        CommandArguments.prototype.testPrepareNameAndNumberLen3Alias = function () {
            var _a = this.prepare('', 'foobar|3'), name = _a.name, alias = _a.alias;
            name.should.eq('foobar');
            alias.should.eq('foo');
        };
        CommandArguments.prototype.testPrepareNameAndNumberLen1Alias = function () {
            var _a = this.prepare('', 'foobar|1'), name = _a.name, alias = _a.alias;
            name.should.eq('foobar');
            alias.should.eq('f');
        };
        CommandArguments.prototype.testPrepareArgumentVariations = function () {
            var a;
            a = this.prepare("[name:string]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].variadic.should.be.false;
            chai_1.assert.equal(a[0].default, null);
            // a[0].default.should.be.null;
            a[0].description.should.eq('');
            a = this.prepare("[name:string=\"defname\"@the name]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].variadic.should.be.false;
            a[0].default.should.eq('defname');
            a[0].description.should.eq('the name');
        };
        CommandArguments.prototype.testPrepareMultiArgumentVariations = function () {
            var a = this.prepare("\n[name:string=\"asdfrr\"@the string for this]\n[projects:string[]=[\"asdf\",\"ffd\"]@project key or keys]\n[num:number=123@single number]\n[nums:number[]=[123,321]@array of numbers]\n[bool:boolean=true@signle boolean]\n[bools:boolean[]=[true,false,true]@array of booleans]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].default.should.eq('asdfrr');
            a[0].description.should.eq('the string for this');
            a[1].name.should.eq('projects');
            a[1].type.should.eq('string');
            a[1].variadic.should.be.true;
            a[1].default.should.contain.ordered.members(['asdf', 'ffd']);
            a[1].description.should.eq('project key or keys');
            a[2].name.should.eq('num');
            a[2].type.should.eq('number');
            a[2].default.should.eq(123);
            a[2].description.should.eq('single number');
            a[3].name.should.eq('nums');
            a[3].type.should.eq('number');
            a[3].variadic.should.be.true;
            a[3].default.should.contain.ordered.members([123, 321]);
            a[3].description.should.eq('array of numbers');
        };
        CommandArguments.prototype.testPrepareArgumentsDefaults = function () {
            var a = this.prepare("\n[name:string=\"asdfrr\"@the string for this]\n[projects:string[]=[\"asdf\",\"ffd\"]@project key or keys]\n[num:number=123@single number]\n[nums:number[]=[123,321]@array of numbers]\n[bool:boolean=true@signle boolean]\n[bools:boolean[]=[true,false,true]@array of booleans]").arguments;
            a[0].default.should.eq('asdfrr');
            a[1].default.should.contain.ordered.members(['asdf', 'ffd']);
            a[2].default.should.eq(123);
            a[3].default.should.contain.ordered.members([123, 321]);
            a[4].default.should.eq(true);
            a[5].default.should.contain.ordered.members([true, false, true]);
        };
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareNameAndAlias", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareNameAndSameAlias", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareNameAndNumberLen3Alias", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareNameAndNumberLen1Alias", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareArgumentVariations", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareMultiArgumentVariations", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testPrepareArgumentsDefaults", null);
        CommandArguments = __decorate([
            mocha_typescript_1.suite
        ], CommandArguments);
        return CommandArguments;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEscURBQStDO0lBQy9DLDhCQUFxSjtJQUNySixrREFBaUQ7SUFDakQsNkJBQTZCO0lBRTdCLElBQU0sY0FBYyxHQUFLLGVBQVMsQ0FBQyxHQUFHLENBQXlCLHdCQUF3QixDQUFDLENBQUM7SUFDekYsSUFBTSxnQkFBZ0IsR0FBRyxlQUFTLENBQUMsR0FBRyxDQUEyQiwwQkFBMEIsQ0FBQyxDQUFDO0lBSTdGO1FBQUE7UUFvSkEsQ0FBQztRQWhKVSx1QkFBTSxHQUFiO1lBQ0ksSUFBSSxPQUFPLEdBQUcsRUFXYixDQUFBO1lBQ0QsSUFBSSxNQUFNLEdBQWdCLEVBSXpCLENBQUE7WUFDRCxJQUFJLENBQUMsR0FBRyxHQUFNLHFCQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxpQ0FBTSxHQUFOO1lBQ0ksaUJBQWdCLENBQUM7WUFFakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFUyxrQ0FBTyxHQUFqQixVQUFrQixNQUFjLEVBQUUsT0FBMkI7WUFBM0Isd0JBQUEsRUFBQSxtQkFBMkI7WUFDekQsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLGNBQ3RCLElBQUksQ0FBQyxNQUFNLElBQ2QsSUFBSSxFQUFLLE9BQU8sVUFBSyxNQUFRLElBQy9CLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFHRCxrREFBdUIsR0FBdkI7WUFDVSxJQUFBLG1DQUFnRCxFQUE5QyxjQUFJLEVBQUUsZ0JBQUssQ0FBbUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxF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