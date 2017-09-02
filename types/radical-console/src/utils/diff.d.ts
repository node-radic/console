declare function whatis(x: any): "array" | "object" | "null" | "undefined" | "scalar" | "unknown";
declare function objectDiff(a: any, b: any): any[];
declare function printDiff(a: any, topType: any): void;
export { objectDiff, printDiff, whatis };
