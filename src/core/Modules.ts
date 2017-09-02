import _require from '../utils/require'
import { basename, dirname, join, resolve } from "path";
import { existsSync, lstatSync, readdirSync } from "fs";
import { singleton } from "./Container";
import globule = require("globule");

const isDirectory    = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

@singleton('cli.modules')
export class Modules {
    basePath: string = resolve(__dirname, '../../modules')
    protected _keys:string[]

    path(to?: string): string {
        return to ? resolve(this.basePath, to) : this.basePath
    }

    exists(id: string): boolean {
        return this.keys().includes(id);
    }

    get<T>(id: string): T {
        return _require(this.path(id))
    }

    keys(forceScan:boolean=false): string[] {
        if(forceScan || ! this._keys) {
            this._keys = globule.find(this.path('*/index.js')).map(dirPath => basename(dirname(dirPath)))
        }
        return this._keys
    }
}