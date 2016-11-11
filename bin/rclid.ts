// https://nodejs.org/api/dgram.html
import * as dgram from 'dgram';
const server = dgram.createSocket('udp4')

// msg = 'put lastpass password 234234'
// msg = 'get lastpass password'
// msg = 'del lastpass password'
// msg = 'has lastpass password'
function parseMessage(msg){

}

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    var address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
