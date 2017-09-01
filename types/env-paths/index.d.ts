declare namespace envPaths {
    interface EnvPathsOptions {
        /**
         * Don't use this option unless you really have to!
         * Suffix appended to the project name to avoid name conflicts with native apps. Pass an empty string to disable it.
         *
         * default: 'nodejs'
         */
        suffix: string
    }

    interface EnvPaths {
        data: string
        config: string
        cache: string
        log: string
        temp: string
    }

    interface EnvPathsStatic {

    }
}
declare function envPaths (name: string, options?: envPaths.EnvPathsOptions) : envPaths.EnvPaths

declare module "env-paths" {
    export = envPaths
}
