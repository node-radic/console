import _require from '../utils/require'
import { basename, dirname, join, resolve } from "path";
import { existsSync, lstatSync, readdirSync } from "fs";
import { Output } from "../../modules/output/Output";
import { dirSync } from "tmp";
import { dirs, ls } from "shelljs";
import { singleton } from "./Container";
import globule = require("globule");

const isDirectory    = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

@singleton('cli.modules')
export class Modules {
    basePath: string = resolve(__dirname, '../../modules')

    path(to?: string): string {
        return to ? resolve(this.basePath, to) : this.basePath
    }

    exists(id: string): boolean {
        return existsSync(this.path(id))
    }

    get<T>(id: string): T {
        return _require(this.path(id))
    }

    keys(): string[] {
        return globule.find(this.path('*/index.js')).map(dirPath => basename(dirname(dirPath)))
        // return getDirectories(this.basePath)
    }
}