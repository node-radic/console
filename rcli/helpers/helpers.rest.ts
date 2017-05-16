import Axios, { AxiosInstance } from 'axios';
import * as _ from 'lodash';
import { helper } from "../../src";



@helper('rest', {
    config: {

    }
})
export class Rest {
    options:any
    protected axios: AxiosInstance;

    constructor(options:any){
        this.options = _.merge({
            baseUrl: '',
            timeout: 1000,
            headers: {}
        }, options)

        this.axios = Axios.create({

        })
        this.axios.get('')
    }
}
