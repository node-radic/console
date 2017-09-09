import "module-alias/register.js";
import "reflect-metadata";
import { CommandArguments, OutputHelper } from "radical-console";
export default class  {
    out: OutputHelper;
    handle(args: CommandArguments, argv: string[]): void;
}
