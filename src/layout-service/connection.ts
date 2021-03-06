/**
 * @hidden
 */

/**
 * File contains vars used to establish service connection between client and provider.
 *
 * These are separated out from 'internal.ts' as including these from provider code will cause the provider to connect
 * to itself.
 *
 * These types are a part of the client, but are not required by applications wishing to interact with the service.
 * This file is excluded from the public-facing TypeScript documentation.
 */
import {EventEmitter} from './events.js';

import {SnapAndDockEvent} from './snapanddock.js';
import {TabbingEvent} from './tabbing.js';
import {TabstripEvent} from './tabstrip.js';
import {WorkspacesEvent} from './workspaces.js';

import {APITopic, SERVICE_CHANNEL} from './internal.js';
import {ChannelClient} from './types/api/interappbus/channel/client.js';


/**
 * The version of the NPM package.
 *
 * Webpack replaces any instances of this constant with a hard-coded string at build time.
 */
// declare const PACKAGE_VERSION: string;
const PACKAGE_VERSION = '1.1.1';

/**
 * Defines all events that are fired by the service
 */
export type LayoutsEvent = TabstripEvent|TabbingEvent|WorkspacesEvent|SnapAndDockEvent;

/**
 * The event emitter to emit events received from the service.  All addEventListeners will tap into this.
 */
export const eventEmitter = new EventEmitter();

/**
 * Promise to the channel object that allows us to connect to the client
 */
let channelPromise: Promise<ChannelClient>|null = null;

if (typeof fin !== 'undefined') {
    getServicePromise();
}

export function getServicePromise(): Promise<ChannelClient> {
    if (!channelPromise) {
        channelPromise = typeof fin === 'undefined' ?
            Promise.reject(new Error('fin is not defined. The openfin-layouts module is only intended for use in an OpenFin application.')) :
            fin.InterApplicationBus.Channel
                .connect(SERVICE_CHANNEL, {payload: {version: PACKAGE_VERSION || '0.0.0'}})
                //@ts-ignore
                .then((channel: ChannelClient) => {
                    // Register service listeners
                    channel.register('WARN', (payload: any) => console.warn(payload));  // tslint:disable-line:no-any
                    channel.register('event', (event: LayoutsEvent) => {
                        eventEmitter.emit(event.type, event);
                    });
                    // Any unregistered action will simply return false
                    channel.setDefaultAction(() => false);

                    return channel;
                });
    }

    return channelPromise;
}

/**
 * Wrapper around service.dispatch to help with type checking
 */
export async function tryServiceDispatch<T, R>(action: APITopic, payload?: T): Promise<R> {
    const channel: ChannelClient = await getServicePromise();
    return channel.dispatch(action, payload) as Promise<R>;
}
