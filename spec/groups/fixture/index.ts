import { Cli, Route } from "../../../src";
export * from './nodes'
export * from './root'

export const cli = Cli.getInstance();
cli.events.on('route:execute', (route: Route<any, any>) => {
    // cli.get<Output>('console.helpers.output').dump(route);
    return 324
})
export default cli;


