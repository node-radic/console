import { command , IArgumentDefinition } from "../../src";
import { ConnectionGroup, ConnectionCommand } from "./con";

@command('cp', 'Copy connection', 'Create a new connection based on an existing one', ConnectionGroup)
export class CopyConnectionCommand extends ConnectionCommand {
    arguments = {
        name: <IArgumentDefinition> {}
    }
}
