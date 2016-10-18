"use strict";
exports.COMMANDO = {
    CONFIG: 'config',
    PATHS: 'paths',
    KEYS: 'keys',
    DATABASE: 'database',
    CONNECTION: 'connection',
    CONNECTIONS: 'connections',
    AUTH: 'auth',
    AUTHS: 'auths',
    REMOTES: 'remotes'
};
Object.keys(exports.COMMANDO).forEach(function (key) { return exports.COMMANDO[key] = Symbol('commando_' + exports.COMMANDO[key]); });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.COMMANDO;
//# sourceMappingURL=bindings.js.map