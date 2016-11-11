import { IConfigProperty, injectable, inject, provide, COMMANDO, provideSingleton } from '../core'
import * as dgram from 'dgram';

@injectable()
export abstract class DGramBase {

    constructor(@inject(COMMANDO.CONFIG) protected config: IConfigProperty) {}


}

@provide(COMMANDO.DGRAM_SERVER)
export class Server extends DGramBase {
}

@provide(COMMANDO.DGRAM_CLIENT)
export class Client extends DGramBase {
}
