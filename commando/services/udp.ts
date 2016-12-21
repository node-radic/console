import { IConfigProperty, injectable, inject, provide, COMMANDO, provideSingleton } from '../core'
import { createSocket, Socket } from 'dgram';

@injectable()
export abstract class DGramBase {

    constructor(@inject(COMMANDO.CONFIG) protected config: IConfigProperty) {}


}

@provide(COMMANDO.DGRAM_SERVER)
export class Server extends DGramBase {
    socket: Socket
    port = 41234
    host = '0.0.0.0';

    constructor(@inject(COMMANDO.CONFIG) config: IConfigProperty) {
        super(config);
    }

    start() {
        this.socket = createSocket('udp4');
        this.socket.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            this.socket.close();
        })

        this.socket.on('message', (msg, rinfo) => {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
        });

        this.socket.on('listening', () => {
            var address = this.socket.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.socket.bind({ port: this.port, address: this.host });
    }
}

@provide(COMMANDO.DGRAM_CLIENT)
export class Client extends DGramBase {
    socket: Socket
    port    = 41234
    host    = '0.0.0.0';
    timeout = 1000;


    constructor(@inject(COMMANDO.CONFIG) config: IConfigProperty) {
        super(config);
    }

    connect(port?: number, host?: string) {
        this.port = port || this.port;
        this.host = host || this.host;

        this.socket = createSocket('udp4');

        this.socket.send('connect', this.port, this.host, (err) => {
            if ( err ) {
                console.log(`client error:`, err);
                return this.socket.close();
            }
            let { port, address } =this.socket.address();
            this.socket.on('message', (msg, rinfo) => {
                console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`, rinfo);
                this.socket.close();
            })
            setTimeout(() => this.socket.close(), this.timeout);
            this.socket.bind({ port: 41235, address });
        })
    }

    send(message) {

    }
}
