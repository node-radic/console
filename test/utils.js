"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const src_1 = require("../src");
const bootstrap_1 = require("./_support/bootstrap");
const parseArguments = src_1.container.get('cli.fn.arguments.parse');
const prepareArguments = src_1.container.get('cli.fn.arguments.prepare');
let CommandArguments = class CommandArguments {
    static before() {
        let helpers = {};
        let config = {};
        this.cli = bootstrap_1.bootstrap(helpers, config);
    }
    before() {
        function Cmd() { }
        this.config = src_1.defaults.command(Cmd);
    }
    prepare(argDef) {
        let config = prepareArguments(Object.assign({}, this.config, { name: `testcmd\n${argDef}` }));
        return config;
    }
    testPrepareArgumentVariations() {
        let a;
        a = this.prepare(`[name:string]`).arguments;
        a[0].name.should.eq('name');
        a[0].type.should.eq('string');
        a[0].variadic.should.be.false;
        assert.equal(a[0].default, null);
        // a[0].default.should.be.null;
        a[0].description.should.eq('');
        a = this.prepare(`[name:string="defname"@the name]`).arguments;
        a[0].name.should.eq('name');
        a[0].type.should.eq('string');
        a[0].variadic.should.be.false;
        a[0].default.should.eq('defname');
        a[0].description.should.eq('the name');
    }
    prepareArguments() {
        let a = this.prepare(`
[name:string="asdfrr"@the string for this]
[projects:string[]=["asdf","ffd"]@project key or keys]
[num:number=123@single number]
[nums:number[]=[123,321]@array of numbers]
[bool:boolean=true@signle boolean]
[bools:boolean[]=[true,false,true]@array of booleans]`).arguments;
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
    }
    testParseArgumentsDefaults() {
        let a = this.prepare(`
[name:string="asdfrr"@the string for this]
[projects:string[]=["asdf","ffd"]@project key or keys]
[num:number=123@single number]
[nums:number[]=[123,321]@array of numbers]
[bool:boolean=true@signle boolean]
[bools:boolean[]=[true,false,true]@array of booleans]`).arguments;
        a[0].default.should.eq('asdfrr');
        a[1].default.should.contain.ordered.members(['asdf', 'ffd']);
        a[2].default.should.eq(123);
        a[3].default.should.contain.ordered.members([123, 321]);
        a[4].default.should.eq(true);
        a[5].default.should.contain.ordered.members([true, false, true]);
    }
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
//# sourceMappingURL=utils.js.map