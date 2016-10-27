declare const _validatorjs: _validatorjs.ValidatorJSConstructor

declare module _validatorjs {
    interface ValidatorJSErrors {
        // errors:{[name:string]:string[]}
        first(name: string): string
        get(name: string): string
        all(): {[name: string]: string[]}
        has(name: string): boolean
        add(attribute: string, message: string)
    }
    interface ValidatorJS {
        fails(): boolean
        passes(): boolean
        errors: ValidatorJSErrors
    }
    interface ValidatorJSConstructor {
        new (data: any, rules: any, customErrorMessages?: any): ValidatorJS

        /**
         * Register Custom Validation Rules
         *
         * @param name The name of the rule
         * @param callbackFn Returns a boolean to represent a successful or failed validation.
         * @param errorMessage An optional string where you can specify a custom error message. :attribute inside errorMessage will be replaced with the attribute name.
         */
        register(name: string, callbackFn: (value: any, requirement: any, attribute: any) => void, errorMessage?: string)
        registerAsync(name: string, fn: (value: any, attribute: any, requirement: any, passes: Function) => void)
        getMessages(lang: string): any
        getDefaultLang(): string
        useLang(lang: string)
        setMessages(lang: string, messages: any)
    }
}

declare module "validatorjs" {
    export = _validatorjs
}
