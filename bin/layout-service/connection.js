/**
 * @hidden
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * File contains vars used to establish service connection between client and provider.
 *
 * These are separated out from 'internal.ts' as including these from provider code will cause the provider to connect
 * to itself.
 *
 * These types are a part of the client, but are not required by applications wishing to interact with the service.
 * This file is excluded from the public-facing TypeScript documentation.
 */
import { EventEmitter } from './events.js';
import { SERVICE_CHANNEL } from './internal.js';
/**
 * The event emitter to emit events received from the service.  All addEventListeners will tap into this.
 */
export const eventEmitter = new EventEmitter();
export const PACKAGE_VERSION = '0.0.0';
/**
 * Promise to the channel object that allows us to connect to the client
 */
let channelPromise = null;
if (typeof fin !== 'undefined') {
    getServicePromise();
}
export function getServicePromise() {
    if (!channelPromise) {
        channelPromise = typeof fin === 'undefined' ?
            Promise.reject(new Error('fin is not defined. The openfin-layouts module is only intended for use in an OpenFin application.')) :
            fin.InterApplicationBus.Channel
                .connect(SERVICE_CHANNEL, { payload: { version: PACKAGE_VERSION } })
                //@ts-ignore
                .then((channel) => {
                // Register service listeners
                channel.register('WARN', (payload) => console.warn(payload)); // tslint:disable-line:no-any
                channel.register('event', (event) => {
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
export function tryServiceDispatch(action, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield getServicePromise();
        return channel.dispatch(action, payload);
    });
}
