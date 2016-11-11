"use strict";
exports.COMMANDO = {
    CONFIG: 'config',
    PATHS: 'paths',
    KEYS: 'keys',
    DATABASE: 'database',
    CACHE: 'cache',
    CONNECTION: 'connection',
    CONNECTIONS: 'connections',
    AUTH: 'auth',
    AUTHS: 'auths',
    REMOTES: 'remotes',
    DGRAM_SERVER: 'dgram_server',
    DGRAM_CLIENT: 'dgram_client'
};
Object.keys(exports.COMMANDO).forEach((key) => exports.COMMANDO[key] = Symbol('commando_' + exports.COMMANDO[key]));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.COMMANDO;
//# sourceMappingURL=bindings.js.map