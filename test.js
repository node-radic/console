const util = require('@radic/util');
const inspect = util.inspect

function getFunction() {
    let fn = function (a,b) {
    }
    return fn;
}

let fnn = getFunction();
inspect({fnn, arg: fnn.arguments, con: fnn.prototype.constructor });

let desc = Object.getOwnPropertyDescriptor(fnn, 'name');
desc.value = 'myfunc'
Object.defineProperty(fnn, 'name', desc)

console.log('k')
