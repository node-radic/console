import * as _ from 'lodash'
import { remote, RemoteExtra, RestRemote, AuthMethod, RemoteType, Remote } from "../remote";


export class JiraExtra extends RemoteExtra {
    getName(): string {
        return 'url';
    }

    getPrettyName(): string {
        return 'URL';
    }
    name = 'url'
    prettyName = 'Jira Server Base URL'
}

@remote('ssh', 'SSH', 'ssh')
export class SSHRemote extends Remote {
    getAuthMethods(){ return  [AuthMethod.key] }
    usesExtra = true


    protected init() {

    }

}
