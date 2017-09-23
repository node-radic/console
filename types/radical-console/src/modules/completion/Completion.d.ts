/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Completion extends EventEmitter {
    private compgen;
    private install;
    private installFish;
    private isDebug;
    private fragment;
    private line;
    private word;
    private HOME;
    private SHELL;
    private program;
    private programs;
    private fragments;
    private shell;
    constructor();
    setProgram(programs: any): any;
    setFragments(): void;
    generate(): never;
    reply(words: any): never;
    tree(objectTree: any): this;
    generateCompletionCode(): any;
    generateCompletionCodeFish(): any;
    generateTestAliases(): string;
    checkInstall(): void;
    getActiveShell(): "bash" | "zsh" | "fish";
    getDefaultShellInitFile(): any;
    setupShellInitFile(initFile: any): never;
    init(): void;
}
export declare function completion(...a: any[]): any;
