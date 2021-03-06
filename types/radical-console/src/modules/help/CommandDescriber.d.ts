import { CommandConfig, HelpHelperOptionsConfig, OptionConfig } from '../../interfaces';
import { HelpHelper } from './HelpHelper';
import { OutputHelper } from '../output/OutputHelper';
import { ColumnsOptions } from '../output/interfaces';
export declare class CommandDescriber {
    command: CommandConfig;
    protected help: HelpHelper;
    protected out: OutputHelper;
    protected readonly config: HelpHelperOptionsConfig;
    protected readonly display: {
        [name: string]: boolean;
        title?: boolean;
        titleLines?: boolean;
        description?: boolean;
        descriptionAsTitle?: boolean;
        usage?: boolean;
        example?: boolean;
        explanation?: boolean;
        arguments?: boolean;
        options?: boolean;
        globalOptions?: boolean;
        commands?: boolean;
        groups?: boolean;
    };
    readonly nl: this;
    write(text: string): this;
    line(text?: string): this;
    protected columns(data: any, options?: ColumnsOptions): this;
    usage(): this;
    arguments(): this;
    commands(): this;
    groups(): this;
    globalOptions(): this;
    options(): this;
    description(): this;
    explanation(): this;
    example(): this;
    protected printOptions(options: OptionConfig[]): this;
}
