import { Command, Group } from "../lib/commands";
export declare class GitGroup extends Group {
}
export declare class GitCloneCommand extends Command {
    arguments: string;
    options: {
        h: {
            alias: string;
            desc: string;
            boolean: boolean;
        };
    };
    handle(): void;
}
export declare class GitRepoGroup extends Group {
}
export declare class GitRepoListCommand extends Command {
    options: {};
    handle(): void;
}
export declare class ConnectionGroup extends Group {
}
export declare class ConnectionListCommand extends Command {
    options: {};
    handle(): void;
}
export declare class ConnectionAddCommand extends Command {
    options: {};
    handle(): void;
}
export declare class ConnectionEditCommand extends Command {
    options: {};
    handle(): void;
}
export declare class ConnectionRemoveCommand extends Command {
    options: {};
    handle(): void;
}
export declare class JiraGroup extends Group {
}
export declare class JiraProjectsGroup extends Group {
}
export declare class JiraProjectsListCommand extends Command {
    options: {};
    handle(): void;
}
export declare class JenkinsGroup extends Group {
}
