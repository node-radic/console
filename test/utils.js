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
        define(["require", "exports", "mocha-typescript", "../src", "./_support/bootstrap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mocha_typescript_1 = require("mocha-typescript");
    var src_1 = require("../src");
    var bootstrap_1 = require("./_support/bootstrap");
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
        CommandArguments.prototype.prepare = function (argDef) {
            var config = prepareArguments(__assign({}, this.config, { name: "testcmd\n" + argDef }));
            return config;
        };
        CommandArguments.prototype.testPrepareArgumentVariations = function () {
            var a;
            a = this.prepare("[name:string]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].variadic.should.be.false;
            assert.equal(a[0].default, null);
            // a[0].default.should.be.null;
            a[0].description.should.eq('');
            a = this.prepare("[name:string=\"defname\"@the name]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].variadic.should.be.false;
            a[0].default.should.eq('defname');
            a[0].description.should.eq('the name');
        };
        CommandArguments.prototype.prepareArguments = function () {
            var a = this.prepare("\n[name:string=\"asdfrr\"@the string for this]\n[projects:string[]=[\"asdf\",\"ffd\"]@project key or keys]\n[num:number=123@single number]\n[nums:number[]=[123,321]@array of numbers]\n[bool:boolean=true@signle boolean]\n[bools:boolean[]=[true,false,true]@array of booleans]").arguments;
            a[0].name.should.eq('name');
            a[0].type.should.eq('string');
            a[0].default.should.eq('asdfrr');
            a[0].description.should.eq('the string for this');
            a[1].name.should.eq('projects');
            a[1].type.should.eq('string');
            a[1].variadic.should.be.true;
            a[1].default.should.contain.ordered.members(["asdf", "ffd"]);
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
        CommandArguments.prototype.testParseArgumentsDefaults = function () {
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
        ], CommandArguments.prototype, "testPrepareArgumentVariations", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "prepareArguments", null);
        __decorate([
            mocha_typescript_1.test,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], CommandArguments.prototype, "testParseArgumentsDefaults", null);
        CommandArguments = __decorate([
            mocha_typescript_1.suite
        ], CommandArguments);
        return CommandArguments;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEscURBQStDO0lBQy9DLDhCQUFxSjtJQUNySixrREFBaUQ7SUFFakQsSUFBTSxjQUFjLEdBQUssZUFBUyxDQUFDLEdBQUcsQ0FBeUIsd0JBQXdCLENBQUMsQ0FBQztJQUN6RixJQUFNLGdCQUFnQixHQUFHLGVBQVMsQ0FBQyxHQUFHLENBQTJCLDBCQUEwQixDQUFDLENBQUM7SUFHN0Y7UUFBQTtRQW9IQSxDQUFDO1FBaEhVLHVCQUFNLEdBQWI7WUFDSSxJQUFJLE9BQU8sR0FBRyxFQVdiLENBQUE7WUFDRCxJQUFJLE1BQU0sR0FBZ0IsRUFJekIsQ0FBQTtZQUNELElBQUksQ0FBQyxHQUFHLEdBQU0scUJBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELGlDQUFNLEdBQU47WUFDSSxpQkFBZ0IsQ0FBQztZQUVqQixJQUFJLENBQUMsTUFBTSxHQUFHLGNBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVTLGtDQUFPLEdBQWpCLFVBQWtCLE1BQWM7WUFDNUIsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLGNBQ3RCLElBQUksQ0FBQyxNQUFNLElBQ2QsSUFBSSxFQUFFLGNBQVksTUFBUSxJQUM1QixDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBRUssd0RBQTZCLEdBQTdCO1lBQ0YsSUFBSSxDQUEwQixDQUFDO1lBQy9CLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUM1QyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDN0IsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQy9CLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLCtCQUErQjtZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFaEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0NBQWtDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDL0QsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzdCLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2hDLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUNuQyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUMsQ0FBQztRQUVLLDJDQUFnQixHQUFoQjtZQUNGLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsbVJBTXlCLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFMUQsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzdCLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbEMsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUE7WUFFbkQsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ2pDLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQy9CLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUUsTUFBTSxFQUFFLEtBQUssQ0FBRSxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUE7WUFFbkQsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzVCLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDN0IsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBRTdDLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDL0IsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsQ0FBQyxDQUFBO1lBQzNELENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQ3BELENBQUM7UUFFSyxxREFBMEIsR0FBMUI7WUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG1SQU15QixDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzFELENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxLQUFLLENBQUUsQ0FBQyxDQUFBO1lBQ2hFLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsQ0FBQyxDQUFBO1lBQzNELENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM5QixDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFFLENBQUMsQ0FBQTtRQUN4RSxDQUFDO1FBaEVLO1lBQUwsdUJBQUk7Ozs7NkVBZ0JKO1FBRUs7WUFBTCx1QkFBSTs7OztnRUE4Qko7UUFFSztZQUFMLHVCQUFJOzs7OzBFQWNKO1FBdkdDLGdCQUFnQjtZQURyQix3QkFBSztXQUNBLGdCQUFnQixDQW9IckI7UUFBRCx1QkFBQztLQUFBLEFBcEhELElBb0hDIn0=