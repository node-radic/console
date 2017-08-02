interface CallSites {
    getTypeName(): string // returns the type of this as a string. This is the name of the function stored in the constructor field of this, if available, otherwise the object's [[Class]] internal property.
    getFunctionName(): string // returns the name of the current function, typically its name property. If a name property is not available an attempt will be made to try to infer a name from the function's context.
    getMethodName(): string // returns the name of the property of this or one of its prototypes that holds the current function
    getFileName(): string // if this function was defined in a script returns the name of the script
    getLineNumber(): number// if this function was defined in a script returns the current line number
    getColumnNumber(): number// if this function was defined in a script returns the current column number
    getEvalOrigin(): string // if this function was created using a call to eval returns a CallSite object representing the location where eval was called
    isToplevel(): boolean//is this a top-level invocation, that is, is this the global object?
    isEval(): boolean//: does this call take place in code defined by a call to eval?
    isNative(): boolean //: is this call in native V8 code?
    isConstructor(): boolean //: is this a constructor call?
}
declare module 'callsites' {
    declare const callsites: () => CallSites[]
    export = callsites
}


declare module 'mocha-typescript'