import { ChannelBase, ProviderIdentity } from './channel.js';
import Transport from '../../../transport/transport.js';

export declare class ChannelClient extends ChannelBase {
    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']);
    dispatch(action: string, payload?: any): Promise<any>;
}
