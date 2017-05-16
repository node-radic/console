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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var _ = require("lodash");
var src_1 = require("../../src");
var Rest = (function () {
    function Rest(options) {
        this.options = _.merge({
            baseUrl: '',
            timeout: 1000,
            headers: {}
        }, options);
        this.axios = axios_1.default.create({});
        this.axios.get('');
    }
    return Rest;
}());
Rest = __decorate([
    src_1.helper('rest', {
        config: {}
    }),
    __metadata("design:paramtypes", [Object])
], Rest);
exports.Rest = Rest;
//# sourceMappingURL=helpers.rest.js.map