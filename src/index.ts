import "module-alias/register.js"
import "reflect-metadata";
import { resolve } from "path";
import { config } from 'dotenv'

config({
    path: resolve(__dirname, '../.env')
})

import './utils'
import './core'

export { LoggerInstance } from 'winston'
export * from './interfaces'
export * from './errors'
export * from './core'
export * from './utils'
export * from './decorators'
export * from './defaults'
export * from './commands'

export * from './modules/help'
export * from './modules/input'
export * from './modules/log'
export * from './modules/output'
export * from './modules/verbose'
