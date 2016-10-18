"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var remote_1 = require("./remote");
var GithubRemote = (function (_super) {
    __extends(GithubRemote, _super);
    function GithubRemote() {
        _super.apply(this, arguments);
    }
    return GithubRemote;
}(remote_1.Remote));
exports.GithubRemote = GithubRemote;
//# sourceMappingURL=github.js.map