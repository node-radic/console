"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _s = require("underscore.string");
var core_1 = require('../core');
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
        var desc = '';
        if (_s.contains(token, ':')) {
            token = token.split(':');
            desc = token[1].trim();
            token = token[0].toString();
        }
        var arg = { name: token, description: desc, required: false, type: 'string', default: null };
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
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION), 
        __metadata('design:type', Object)
    ], DefinitionSignatureParser.prototype, "definition", void 0);
    DefinitionSignatureParser = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], DefinitionSignatureParser);
    return DefinitionSignatureParser;
}());
exports.DefinitionSignatureParser = DefinitionSignatureParser;
//# sourceMappingURL=signature.js.map