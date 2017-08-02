import { command } from "../../src";
import { inject } from "../../src/core/Container";
import { InputHelper } from "../../src/helpers/helper.input";
import { OutputHelper } from "../../src/helpers/helper.output";
@command('inputs')
export default class InputsCmd {
    @inject('cli.helpers.input')
    ask: InputHelper
    @inject('cli.helpers.output')
    out: OutputHelper

    async handle() {

        let dateTime = await this.ask.datetime('What custom datetime?', null, null, ['d','/','m','/','yyyy'])
        this.out.dump(dateTime)

        let service = await this.ask.autocomplete(`What service? [ 'wash', 'clean', 'build', 'demolish' ]`, [ 'wash', 'clean', 'build', 'demolish' ])
        this.out.dump(service)

        let suggestService = await this.ask.autocomplete(`suggestOnly: What service? [ 'wash', 'clean', 'build', 'demolish' ]`, [ 'wash', 'clean', 'build', 'demolish' ], true)
        this.out.dump(suggestService)


        return Promise.resolve()
    }
}