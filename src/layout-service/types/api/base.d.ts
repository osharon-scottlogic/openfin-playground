/// <reference types="node" />
import Transport from '../transport/transport.js';
import { Identity } from '../src/identity.js';
import { EventEmitter } from 'events.js';
import { EmitterAccessor } from './events/emitterMap.js';
import { BaseEventMap } from './events/base.js';

export declare class Base {
    wire: Transport;
    constructor(wire: Transport);
    private _topic;
    protected topic: string;
    readonly me: Identity;
    protected isNodeEnvironment: () => boolean;
    protected isOpenFinEnvironment: () => boolean;
}
export declare class EmitterBase<EventTypes extends BaseEventMap> extends Base {
    private emitterAccessor;
    protected identity: Identity;
    constructor(wire: Transport, emitterAccessor: EmitterAccessor);
    eventNames: () => (string | symbol)[];
    emit: <E extends string | symbol | Extract<keyof EventTypes, string>>(eventName: E, payload: E extends Extract<keyof EventTypes, string> ? EventTypes[E] : any, ...args: any[]) => boolean;
    private hasEmitter;
    private getEmitter;
    listeners: (type: string | symbol) => Function[];
    listenerCount: (type: string | symbol) => number;
    protected registerEventListener: <E extends string | symbol | Extract<keyof EventTypes, string>>(eventType: E) => Promise<EventEmitter>;
    protected deregisterEventListener: <E extends string | symbol | Extract<keyof EventTypes, string>>(eventType: E) => Promise<void | EventEmitter>;
    on<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void): Promise<this>;
    addListener: <E extends string | symbol | Extract<keyof EventTypes, string>>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void) => Promise<this>;
    once<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void): Promise<this>;
    prependListener<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void): Promise<this>;
    prependOnceListener<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void): Promise<this>;
    removeListener<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType: E, listener: (payload: E extends keyof EventTypes ? EventTypes[E] : any, ...args: any[]) => void): Promise<this>;
    protected deregisterAllListeners: <E extends string | symbol | Extract<keyof EventTypes, string>>(eventType: E) => Promise<void | EventEmitter>;
    removeAllListeners<E extends Extract<keyof EventTypes, string> | string | symbol>(eventType?: E): Promise<this>;
}
export declare class Reply<TOPIC extends string, TYPE extends string | void> implements Identity {
    topic: TOPIC;
    type: TYPE;
    uuid: string;
    name?: string;
}
