"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeOf = (function () {
    function TypeOf(val) {
        this.val = val;
    }
    TypeOf.prototype.equals = function (otherVal) { return this.val === otherVal; };
    TypeOf.prototype.is = function (otherVal) { return this.val === otherVal; };
    TypeOf.prototype.toString = function () { return typeof this.val.toString === 'function' ? this.val.toString() : this.val; };
    TypeOf.create = function (val) { return new TypeOf(val); };
    return TypeOf;
}());
exports.TypeOf = TypeOf;
//# sourceMappingURL=utils.js.map