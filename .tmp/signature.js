"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _s = require("underscore.string");
var inversify_1 = require("inversify");
var types_1 = require("../types");
var DefinitionSignatureParser = (function () {
    function DefinitionSignatureParser() {
    }
    DefinitionSignatureParser.prototype.parse = function (signature) {
        this.signature = signature;
        var exp = /\{\s*(.*?)\s*\}/g;
        var match;
        while ((match = exp.exec(signature)) !== null) {
            var token = match[1].toString();
            if (token.startsWith('-')) {
                this.parseOption(token);
            }
            else {
                this.parseArgument(token);
            }
        }
        return this.definition;
    };
    DefinitionSignatureParser.prototype.parseArgument = function (token) {
        // {name:The required name} {email?:The optional email}
        var desc = '';
        if (_s.contains(token, ':')) {
            token = token.split(':');
            desc = token[1].trim();
            token = token[0].toString();
        }
        var arg = { name: token, description: desc, required: false, type: 'string', default: null };
        // suggest to make it work more with regex for more advanced signatures:
        // https://regex101.com/r/aK6wE0/1
        var exp = /(.+)\=(.+)/;
        switch (true) {
            case _s.endsWith(token, '?*'):
                arg.name = _s.rtrim(token, '?*');
                arg.type = 'array';
                arg.required = false;
                break;
            case _s.endsWith(token, '*'):
                arg.name = _s.rtrim(token, '*');
                arg.type = 'array';
                arg.required = true;
                break;
            case _s.endsWith(token, '?'):
                arg.name = _s.rtrim(token, '?');
                break;
            case exp.test(token):
                arg.required = false;
                arg.name = token.match(exp)[1];
                arg.default = token.match(exp)[2];
                break;
            default:
                arg.required = true;
        }
        this.definition.argument(arg.name, arg.description, arg.required, arg.type, arg.default);
    };
    DefinitionSignatureParser.prototype.parseOption = function (token) {
        var _a = token.split(':'), _names = _a[0], description = _a[1];
        var names = _names.split('|').map(function (name) {
            return name.replace(/\-/g, '');
        });
        var name = names.shift();
        // this.options[name]        = {
        //     name       : name,
        //     aliases    : names,
        //     description: description
        // }
        // names.forEach((alias: string) => this.options[alias] = name)
    };
    __decorate([
        inversify_1.inject(types_1.BINDINGS.OPTIONS_DEFINITION)
    ], DefinitionSignatureParser.prototype, "definition", void 0);
    DefinitionSignatureParser = __decorate([
        inversify_1.injectable()
    ], DefinitionSignatureParser);
    return DefinitionSignatureParser;
}());
exports.DefinitionSignatureParser = DefinitionSignatureParser;
