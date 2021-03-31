import { ChannelClient } from './client.js';
import { Identity } from '../../../src/identity.js';
import { ChannelProvider } from './provider.js';
import { EmitterBase } from '../../base.js';
import Transport, { Message, Payload } from '../../../transport/transport.js';
import { ProviderIdentity } from './channel.js';
import { ChannelEvents } from '../../events/channel.js';
export interface ConnectOptions {
    wait?: boolean;
    payload?: any;
}
export interface ChannelPayload {
    payload: Payload;
}
export interface ChannelMessage extends Message<any> {
    senderIdentity: Identity;
    ackToSender: any;
    providerIdentity: Identity;
    connectAction: boolean;
}
export declare class Channel extends EmitterBase<ChannelEvents> {
    private channelMap;
    constructor(wire: Transport);
    getAllChannels(): Promise<ProviderIdentity[]>;
    onChannelConnect(listener: (...args: any[]) => void): Promise<void>;
    onChannelDisconnect(listener: (...args: any[]) => void): Promise<void>;
    connect(channelName: string, options?: ConnectOptions): Promise<ChannelClient>;
    create(channelName: string): Promise<ChannelProvider>;
    onmessage: (msg: ChannelMessage) => boolean;
    private processChannelMessage;
    private processChannelConnection;
}
