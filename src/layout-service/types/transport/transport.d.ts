/// <reference types="node" />
import { Wire, WireConstructor, READY_STATE, ExistingConnectConfig, ConnectConfig, InternalConnectConfig } from './wire';
import { Identity } from '../identity.js'
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Environment } from '../environment/environment.js';
import { RuntimeEvent } from '../api/events/base.js';
import { EventAggregator } from '../api/events/eventAggregator.js';
export declare type MessageHandler = (data: any) => boolean;
declare class Transport extends EventEmitter {
    protected wireListeners: Map<number, {
        resolve: Function;
        reject: Function;
    }>;
    protected uncorrelatedListener: Function;
    me: Identity;
    protected wire: Wire;
    environment: Environment;
    topicRefMap: Map<string, number>;
    sendRaw: Wire['send'];
    eventAggregator: EventAggregator;
    protected messageHandlers: MessageHandler[];
    constructor(wireType: WireConstructor, environment: Environment);
    connectSync: (config: ConnectConfig) => any;
    connect(config: InternalConnectConfig): Promise<string>;
    connectByPort(config: ExistingConnectConfig): Promise<string>;
    READY_STATE: typeof READY_STATE;
    ferryAction(data: any): Promise<Message<any>>;
    registerMessageHandler(handler: MessageHandler): void;
    protected addWireListener(id: number, resolve: Function, reject: Function, uncorrelated: boolean): void;
    protected onmessage(data: Message<Payload>): void;
    protected handleMessage(data: Message<Payload>): boolean;
}
export default Transport;
interface Transport {
    sendAction(action: 'request-external-authorization', payload: {}, uncorrelated: true): Promise<Message<AuthorizationPayload>>;
    sendAction(action: string, payload: {}, uncorrelated: boolean): Promise<Message<Payload>>;
    topicRefMap: Map<string, number>;
}
export declare class Message<T> {
    action: string;
    payload: T;
    correlationId?: number;
}
export declare class EventMessage implements Message<RuntimeEvent> {
    action: 'process-desktop-event';
    payload: RuntimeEvent;
}
export declare class NotificationEventMessage implements Message<NotificationEvent> {
    action: 'process-notification-event';
    payload: NotificationEvent;
}
export interface NotificationEvent {
    payload: {
        notificationId: string;
    };
    type: string | symbol;
}
export declare class Payload {
    success: boolean;
    data: any;
}
export declare class AuthorizationPayload {
    token: string;
    file: string;
}
