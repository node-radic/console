import { Cli } from "./Cli";
import { container } from "./Container";
export abstract class Event {
    public get cli(): Cli {
        return container.get<Cli>('cli');
    }

    constructor(public event: string | string[] = undefined) {}
}
export abstract class HaltEvent extends Event {
    public halt: boolean = false;

    public stop() { this.halt = true }
}