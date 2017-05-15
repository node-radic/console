const callsites = require('callsites');

export function dumpCallsites(){

    let sites = callsites();
    for(let i=0; i<sites.length; i++){
        console.log(i, 'getTypeName', sites[i].getTypeName())
        console.log(i, 'getFileName', sites[i].getFileName())
        console.log(i, 'getFunctionName', sites[i].getFunctionName())
        console.log(i, 'getMethodName', sites[i].getMethodName())
        console.log(i, 'getFileName', sites[i].getFileName())
        console.log(i, 'getLineNumber', sites[i].getLineNumber())
        console.log(i, 'getColumnNumber', sites[i].getColumnNumber())
        console.log(i, 'getEvalOrigin', sites[i].getEvalOrigin())
        console.log(i, 'isToplevel', sites[i].isToplevel())
        console.log(i, 'isEval', sites[i].isEval())
        console.log(i, 'isNative', sites[i].isNative())
        console.log(i, 'isConstructor', sites[i].isConstructor())
    }
}