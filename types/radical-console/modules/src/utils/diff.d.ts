export declare type DiffResult = any[];
export declare class Diff {
    protected o: object;
    protected o2: object;
    diff: DiffResult;
    constructor(o: object, o2: object);
    getDiff(): DiffResult;
    printDiff(): void;
}
