import { Cli, Registry, interfaces as i, Command } from "../src";
export * from './nodes'
export * from './root'

export const cli = Cli.getInstance();
export default cli;


//
//
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed,route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed2,parsed2route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed4,parsed4route});
// console.log('-----------------------------------------------------------------------------------------')
