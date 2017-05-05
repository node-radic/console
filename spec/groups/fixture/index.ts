import { Cli,CliHandledEvent,Resolver } from "../../../src";
export * from './nodes'
export * from './root'

const startTime  = Date.now();
export const cli = Cli.getInstance();

cli.events.on('cli:handled', (event: CliHandledEvent) => {
    const endTime = Date.now();
    const resolver = cli.get<Resolver>('console.resolver');
    let parents = resolver.parentsOf(event.parsedNode.getConfig())
    let tree = resolver.getTree();
    console.log(`
start: ${startTime}
end:   ${endTime}
total: ${endTime - startTime}
`)
})

cli
    .helpers('input') // .helpers('input', 'output')
    .helper('output', {
        // quiet : false,
        quietOption : { enabled: true }, // keys: [ 'q', 'quiet' ]
        // colors: true,
        colorsOption: { enabled: true }, // keys: [ 'C', 'no-colors' ]
        styles      : {
            success: 'blue lighten 20 bold', //'green lighten 20 bold',
        }
    })
    .helper('describer', {
        helpOption: {
            enabled: true //, keys: ['h', 'help']
        }
    })


export default function start() {
    let parsedRootNode = cli.parse()
    let parsedNode     = cli.resolve()
    cli.handle(parsedNode);
}


