import { Diff, HelperOptionsConfig, HelperOptionsConfigOption, HelpersOptionsConfig } from "radical-console";
import { InspectOptions } from "util";
import { Colors, Parser } from "@radic/console-colors";


export type TruncateFunction = (input: string, columns: number, options?: TruncateOptions) => string
export type WrapFunction = (input: string, columns: number, options?: WrapOptions) => string;
export type SliceFunction = (inputu: string, beginSlice: number, endSlice?: number) => string;
export type WidestFunction = (input: string) => number;
export type TruncatePosition = 'start' | 'middle' | 'end'


export interface TreeData {
    label: string;
    nodes?: (TreeData | string)[];
}

export interface TreeOptions {
    unicode?: boolean;
}

export interface OutputSpinners {
    ora?: any
    multi?: any
    single?: any
}

export interface TruncateOptions {
    position?: TruncatePosition
}

export interface WrapOptions {
    /**
     * By default the wrap is soft, meaning long words may extend past the column width. Setting this to true will make it hard wrap at the column width.
     * default: false
     */
    hard?: boolean
    /**
     * By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns.
     * If wordWrap is false, each column will instead be completely filled splitting words as necessary.
     * default: true
     */
    wordWrap?: boolean
    /**
     * Whitespace on all lines is removed by default. Set this option to false if you don't want to trim.
     * default: true
     */
    trim?: boolean
}


export interface OutputOptions {
    enabled?: boolean
    colors?: boolean
    inspect?: InspectOptions
}

export interface IOutputUtil {
    parser: Parser
    colors: Colors
    figures: Figures
    useColors: boolean

    disableColors(): this

    enableColors(): this

    /** transforms a text with color-brackets to text with color-codes */
    parse: (text: string, force?: boolean) => string
    /** clears a text from its color-brackets */
    clean: (text: string) => string
    /** Truncate a string with ANSI escape codes, uses "cli-truncate" */
    truncate: (input: string, columns: number, options?: TruncateOptions) => string
    /** Wordwrap a string with ANSI escape codes, uses: "wrap-ansi" */
    wrap: (input: string, columns: number, options?: WrapOptions) => string
    /** Slice a string with ANSI escape codes, uses: "slice-ansi" */
    slice: (inputu: string, beginSlice: number, endSlice?: number) => string
    /**
     * Get the visual width of the widest line in a string - the number of columns required to display it
     * Some Unicode characters are fullwidth and use double the normal width. ANSI escape codes are stripped and doesn't affect the width.
     * Useful to be able to know the maximum width a string will take up in the terminal.
     * @param {string} input
     */
    widest: (input: string) => number
    /**
     * Get the visual width of a string - the number of columns required to display it
     * Some Unicode characters are fullwidth and use double the normal width. ANSI escape codes are stripped and doesn't affect the width.
     *
     * Useful to be able to measure the actual width of command-line output.
     * @param {string} input
     * @returns {number}
     */
    width: (input: string) => number

}

export interface IOutput {
    stdout: NodeJS.WriteStream
    options: OutputOptions

    /** writes new line to stdout */
    nl: this
    /** write text to stdout */
    write: (text: string) => this
    /** write new line or text + new line to stdout */
    line?: (text: string) => this
    /** dumps objects to stdout */
    dump?: (...args: any[]) => this
    /** returns a macro */
    macro: (name: string) => (...args: any[]) => string
    /** defines a macro */
    setMacro: (name: string, macro: (...args: any[]) => string) => this
    /** displays the difference between 2 objects */
    diff?: (o: object, o2: object) => Diff

    spinner?: (text?: string) => any

    spinners?: any[]

    beep?: (val?: number, cb?: Function) => this

    util: IOutputUtil
}


export interface HelpersOptionsConfig {
    output: OutputHelperOptionsConfig
}

export interface OutputHelperOptionsConfig extends HelperOptionsConfig {
    quiet?: boolean,
    colors?: boolean,
    options?: {
        quiet?: HelperOptionsConfigOption,
        colors?: HelperOptionsConfigOption
    },
    resetOnNewline?: boolean,
    styles?: { [name: string]: string },
    tableStyle?: { [name: string]: { [name: string]: string } }
}


export interface Figures {
    tick: string
    cross: string
    star: string
    square: string
    squareSmall: string
    squareSmallFilled: string
    play: string
    circle: string
    circleFilled: string
    circleDotted: string
    circleDouble: string
    circleCircle: string
    circleCross: string
    circlePipe: string
    circleQuestionMark: string
    bullet: string
    dot: string
    line: string
    ellipsis: string
    pointer: string
    pointerSmall: string
    info: string
    warning: string
    hamburger: string
    smiley: string
    mustache: string
    heart: string
    arrowUp: string
    arrowDown: string
    arrowLeft: string
    arrowRight: string
    radioOn: string
    radioOff: string
    checkboxOn: string
    checkboxOff: string
    checkboxCircleOn: string
    checkboxCircleOff: string
    questionMarkPrefix: string
    oneHalf: string
    oneThird: string
    oneQuarter: string
    oneFifth: string
    oneSixth: string
    oneSeventh: string
    oneEighth: string
    oneNinth: string
    oneTenth: string
    twoThirds: string
    twoFifths: string
    threeQuarters: string
    threeFifths: string
    threeEighths: string
    fourFifths: string
    fiveSixths: string
    fiveEighths: string
    sevenEighths: string
}
