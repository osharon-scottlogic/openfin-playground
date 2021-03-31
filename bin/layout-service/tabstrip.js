var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { eventEmitter, tryServiceDispatch } from './connection.js';
import { parseIdentity, TabAPI } from './internal.js';
export function addEventListener(eventType, listener) {
    if (typeof fin === 'undefined') {
        throw new Error('fin is not defined. The openfin-layouts module is only intended for use in an OpenFin application.');
    }
    eventEmitter.addListener(eventType, listener);
}
export function removeEventListener(eventType, listener) {
    if (typeof fin === 'undefined') {
        throw new Error('fin is not defined. The openfin-layouts module is only intended for use in an OpenFin application.');
    }
    eventEmitter.removeListener(eventType, listener);
}
/**
 * Informs the layouts service a tab HTML5 drag sequence has begun.  Required at the beginning of any tabstrip drag operation.
 * Only one dragging operation should ever be taking place.
 *
 * ```ts
 * import {tabstrip} from 'openfin-layouts';
 *
 * window.document.body.addEventListener("dragstart", (event) => {
 *      tabstrip.startDrag({uuid: 'App0', name: 'App0'});
 * });
 * ```
 *
 * @param identity The identity of the tab which is being dragged.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 */
export function startDrag(identity) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.STARTDRAG, parseIdentity(identity));
    });
}
/**
 * Informs the layouts service a tab HTML5 drag sequence has ended.  Required at the end of any tabstrip drag operation.
 * Only one dragging operation should ever be taking place.
 *
 * ```ts
 * import {tabstrip} from 'openfin-layouts';
 *
 * window.document.body.addEventListener("dragend", (event) => {
 *      tabstrip.endDrag();
 * })
 * ```
 */
export function endDrag() {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.ENDDRAG);
    });
}
/**
 * Updates the layouts service provider with the new order of tabs in a tabstrip.  Required for workspace restore operations to restore the tabs in the correct
 * order.
 *
 * This call is purely informational and will not trigger any events.
 *
 * The length of the provided array must match the current number of tabs, and each current tab must appear in the array exactly once to be valid.
 *
 * ```ts
 * import {tabstrip} from 'openfin-layouts';
 *
 * const tabs = [{uuid: 'App0', name: 'App0'}, {uuid: 'App1', name: 'App1'}, {uuid: 'App2', name: 'App2'}];
 *
 * tabstrip.reorderTabs(tabs);
 * ```
 *
 * @param newOrder The new order of the tabs.  First index in the array will match the first tab in the strip.
 * @throws `Error`: If the provided value is not an array.
 * @throws `Error`: If array item type `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity |
 * Identity}.
 * @throws `Error`: If not all tabs present in the tabstrip are in the provided array.
 * @throws `Error`: If array item is not in the calling tab group.
 */
export function reorderTabs(newOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.REORDERTABS, newOrder.map(identity => parseIdentity(identity)));
    });
}
