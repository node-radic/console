import "reflect-metadata";
import { CommandArguments, OutputHelper } from "../src";
export default class  {
    out: OutputHelper;
    handle(args: CommandArguments, argv: string[]): void;
}
