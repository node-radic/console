"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var src_1 = require("../src");
var bootstrap_1 = require("./_support/bootstrap");
var CommandArguments = (function () {
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
        var config = src_1.prepareArguments(__assign({}, this.config, { name: "testcmd\n" + argDef }));
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
        mocha_typescript_1.test
    ], CommandArguments.prototype, "testPrepareArgumentVariations", null);
    __decorate([
        mocha_typescript_1.test
    ], CommandArguments.prototype, "prepareArguments", null);
    __decorate([
        mocha_typescript_1.test
    ], CommandArguments.prototype, "testParseArgumentsDefaults", null);
    CommandArguments = __decorate([
        mocha_typescript_1.suite
    ], CommandArguments);
    return CommandArguments;
}());
