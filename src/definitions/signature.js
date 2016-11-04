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
const _s = require("underscore.string");
const core_1 = require('../core');
let DefinitionSignatureParser = class DefinitionSignatureParser {
    parse(signature) {
        this.signature = signature;
        let exp = /\{\s*(.*?)\s*\}/g;
        let match;
        while ((match = exp.exec(signature)) !== null) {
            let token = match[1].toString();
            if (token.startsWith('-')) {
                this.parseOption(token);
            }
            else {
                this.parseArgument(token);
            }
        }
        return this.definition;
    }
    parseArgument(token) {
        let desc = '';
        if (_s.contains(token, ':')) {
            token = token.split(':');
            desc = token[1].trim();
            token = token[0].toString();
        }
        let arg = { name: token, desc: desc, required: false, type: 'string', default: null };
        let exp = /(.+)\=(.+)/;
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
        this.definition.argument(arg.name, arg.desc, arg.required, arg.type, arg.default);
    }
    parseOption(token) {
        let [_names, description] = token.split(':');
        let names = _names.split('|').map((name) => {
            return name.replace(/\-/g, '');
        });
        let name = names.shift();
    }
};
__decorate([
    core_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION), 
    __metadata('design:type', Object)
], DefinitionSignatureParser.prototype, "definition", void 0);
DefinitionSignatureParser = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], DefinitionSignatureParser);
exports.DefinitionSignatureParser = DefinitionSignatureParser;
//# sourceMappingURL=signature.js.map