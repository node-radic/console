

import { BasePluginConfig, Plugin, PluginRegisterHelper } from "../../interfaces";
export interface CryptoFilePluginConfig extends BasePluginConfig {

}
export const CryptoFilePlugin:Plugin<CryptoFilePluginConfig> = {
    name: 'crypto-file-config',
    depends: [],
    register: (config:CryptoFilePluginConfig, helper:PluginRegisterHelper) => {
        helper.helpers.
    }
}
export default CryptoFilePlugin