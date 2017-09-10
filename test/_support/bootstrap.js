(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chai/register-assert", "chai/register-expect", "chai/register-should", "../../src", "@radic/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chai/register-assert"); // Using Assert style
    require("chai/register-expect"); // Using Expect style
    require("chai/register-should"); // Using Should style
    var src_1 = require("../../src");
    var util_1 = require("@radic/util");
    function bootstrap(helpers, config) {
        if (config === void 0) { config = {}; }
        src_1.cli.config.merge(config);
        util_1.objectLoop(helpers, function (name, config) {
            src_1.cli.helper(name, config);
        });
        return src_1.cli;
    }
    exports.bootstrap = bootstrap;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYm9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsZ0NBQThCLENBQUUscUJBQXFCO0lBQ3JELGdDQUE4QixDQUFFLHFCQUFxQjtJQUNyRCxnQ0FBOEIsQ0FBRSxxQkFBcUI7SUFDckQsaUNBQWlGO0lBQ2pGLG9DQUF5QztJQUV6QyxtQkFBMEIsT0FBd0MsRUFBRSxNQUFzQjtRQUF0Qix1QkFBQSxFQUFBLFdBQXNCO1FBQ3RGLFNBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXhCLGlCQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsSUFBSSxFQUFHLE1BQU07WUFDOUIsU0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsU0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVJELDhCQVFDIn0=