import * as WebSocket from 'ws';
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Wire, READY_STATE } from './wire.js';
export default class WebSocketTransport extends EventEmitter implements Wire {
    protected wire: WebSocket;
    onmessage: (data: any) => void;
    constructor(onmessage: (data: any) => void);
    connect: (address: string) => Promise<any>;
    connectSync: () => any;
    send(data: any, flags?: any): Promise<any>;
    shutdown(): Promise<void>;
    static READY_STATE: typeof READY_STATE;
}
