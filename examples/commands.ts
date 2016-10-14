import {Command, Group, command, group} from "../src";

@group('git', 'Collection of git related commands')
export class GitGroup extends Group
{
}

// lets make some commands
@command('clone', 'Clone a local or remote repository by file path or URL', GitGroup)
export class GitCloneCommand extends Command
{
    arguments = '{name:The name}';

    options = {
        h: {alias: 'with-hidden', desc: 'Include hidden objects', boolean: true}
    };

    handle() {
        this.out.writeln('This is the git command')
        if (this.opt('h')) {
            this.out.writeln('With -h')
        }
    }
}

@group('repo', 'Manage remote repositories', GitGroup)
export class GitRepoGroup extends Group
{
}

@command('list', 'List all repositories for the given connections', GitRepoGroup)
export class GitRepoListCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}

//
// CONNECTIONS

@group('con', 'Manage connections and authentication to services')
export class ConnectionGroup extends Group
{
}

@command('list', 'List all configured connections', ConnectionGroup)
export class ConnectionListCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}

@command('add', 'Add a new connection', ConnectionGroup)
export class ConnectionAddCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}

@command('edit', 'Edit existing connection', ConnectionGroup)
export class ConnectionEditCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}

@command('remove', 'Removes existing connection', ConnectionGroup)
export class ConnectionRemoveCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}

//
// JIRA

@group('jira', 'Interact with a Jira installation')
export class JiraGroup extends Group
{
}

@group('projects', 'Interact with a Jira installation', JiraGroup)
export class JiraProjectsGroup extends Group
{
}

@command('list', 'Removes existing connection', JiraProjectsGroup)
export class JiraProjectsListCommand extends Command
{
    options = {};
    handle() { this.out.writeln('This is the con list command') }
}




@group('jenkins', 'Discover and control a Jenkins server')
export class JenkinsGroup extends Group
{
}


@command('data', 'Show important data')
export class DataCommand extends Command {
    options = {};
    handle() { this.out.writeln('This is the data command') }
}

@command('dump', 'Dump debug values')
export class DumpCommand extends Command {
    options = {};
    handle() { this.out.writeln('This is the data command') }
}
