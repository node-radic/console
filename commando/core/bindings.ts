export let COMMANDO = {
    CONFIG  : 'config',
    PATHS   : 'paths',
    KEYS    : 'keys',
    DATABASE: 'database',
    CACHE: 'cache',

    CONNECTION : 'connection',
    CONNECTIONS: 'connections',

    AUTH : 'auth',
    AUTHS: 'auths',

    REMOTES: 'remotes'

}

Object.keys(COMMANDO).forEach((key) => COMMANDO[ key ] = Symbol('commando_' + COMMANDO[ key ]))

export default COMMANDO
