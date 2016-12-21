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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const core_1 = require('../core');
const dgram_1 = require('dgram');
let DGramBase = class DGramBase {
    constructor(config) {
        this.config = config;
    }
};
DGramBase = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.COMMANDO.CONFIG)), 
    __metadata('design:paramtypes', [Function])
], DGramBase);
exports.DGramBase = DGramBase;
let Server = class Server extends DGramBase {
    constructor(config) {
        super(config);
        this.port = 41234;
        this.host = '0.0.0.0';
    }
    start() {
        this.socket = dgram_1.createSocket('udp4');
        this.socket.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            this.socket.close();
        });
        this.socket.on('message', (msg, rinfo) => {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
        });
        this.socket.on('listening', () => {
            var address = this.socket.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });
        this.socket.bind({ port: this.port, address: this.host });
    }
};
Server = __decorate([
    core_1.provide(core_1.COMMANDO.DGRAM_SERVER),
    __param(0, core_1.inject(core_1.COMMANDO.CONFIG)), 
    __metadata('design:paramtypes', [Function])
], Server);
exports.Server = Server;
let Client = class Client extends DGramBase {
    constructor(config) {
        super(config);
        this.port = 41234;
        this.host = '0.0.0.0';
        this.timeout = 1000;
    }
    connect(port, host) {
        this.port = port || this.port;
        this.host = host || this.host;
        this.socket = dgram_1.createSocket('udp4');
        this.socket.send('connect', this.port, this.host, (err) => {
            if (err) {
                console.log(`client error:`, err);
                return this.socket.close();
            }
            let { port, address } = this.socket.address();
            this.socket.on('message', (msg, rinfo) => {
                console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
                this.socket.close();
            });
            setTimeout(() => this.socket.close(), this.timeout);
            this.socket.bind({ port: 41235, address });
        });
    }
    send(message) {
    }
};
Client = __decorate([
    core_1.provide(core_1.COMMANDO.DGRAM_CLIENT),
    __param(0, core_1.inject(core_1.COMMANDO.CONFIG)), 
    __metadata('design:paramtypes', [Function])
], Client);
exports.Client = Client;
//# sourceMappingURL=udp.js.map