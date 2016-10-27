// export * from './connection'
import { command } from "../../src";
import { AuthMethod } from "../services";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";
import { ConnectionGroup, ConnectionCommand } from "./con";

@command('edit', 'Edit connection', 'Edit a existing connection', ConnectionGroup)
export class EditConnectionCommand extends ConnectionCommand {
}
