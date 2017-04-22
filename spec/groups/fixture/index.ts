import { Cli } from "../../../src";
export * from './nodes'
export * from './root'

export const cli = Cli.getInstance();
cli
    // .helpers('input', 'output')
    .helpers('input')
    .helper('output', {
        quiet : false,
        colors: true,
        styles    : {
            success: 'blue lighten 20 bold', //'green lighten 20 bold',
        }
    })
    .helper('describer', {
        help: ['h', 'help']
    })


export default cli;


