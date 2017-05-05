import { command, group, Describer, inject, Input, interfaces as i, option, Output, ParsedNode } from "../../../../src";
export * from './yarn'
export * from './yarn_install'



/*
- root
    - connect -l
        - set
        - get
        - delete
    - remote -l
        - create
        - delete
        - copy
    - git
        - repo -l
            - create
            - delete
            - mirror
 */

@group('connect', 'SSH connection helper')
export class ConnectGroup {}

@command('set', 'Add/edit a connection.', ConnectGroup)
export class ConnectSetCommand {}

@command('get', 'Print a connection.', ConnectGroup)
export class ConnectGetCommand {}

@command('delete', 'Delete a connection.', ConnectGroup)
export class ConnectDeleteCommand {}

@group('git', 'Remote Git operations.')
export class GitGroup{}

@group('repo', 'Repository operations', GitGroup)
export class GitRepoGroup{}

@command('create', 'Create a repository', GitRepoGroup)
export class GitRepoCreateCommand {}

@command('delete', 'Delete a repository', GitRepoGroup)
export class GitRepoDeleteCommand {}

@command('mirror', 'Mirror a repository to another', GitRepoGroup)
export class GitRepoMirrorCommand {}
