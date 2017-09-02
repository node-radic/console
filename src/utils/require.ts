import { ModuleNotFoundError } from "../errors";

export function requirePeer<T extends any=any>(id: string): T {
    try { return require(id) } catch ( e ) { throw new ModuleNotFoundError(e.message) }
}

export default requirePeer
