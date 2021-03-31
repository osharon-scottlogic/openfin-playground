import { ChannelBase, ProviderIdentity } from './channel.js';
import Transport from '../../../transport/transport.js';
import { Identity } from '../../../src/main.js';

export declare type ConnectionListener = (identity: Identity, connectionMessage?: any) => any;
export declare class ChannelProvider extends ChannelBase {
    private connectListener;
    private disconnectListener;
    connections: Identity[];
    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']);
    dispatch(to: Identity, action: string, payload: any): Promise<any>;
    processConnection(senderId: Identity, payload: any): Promise<any>;
    publish(action: string, payload: any): Promise<any>[];
    onConnection(listener: ConnectionListener): void;
}
