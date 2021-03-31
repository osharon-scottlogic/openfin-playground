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
import { getId, parseIdentity, SnapAndDockAPI } from './internal.js';
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
 * Undocks a window from any group it currently belongs to.
 *
 * Has no effect if the window is not currently docked.
 *
 * ```ts
 * import {snapAndDock} from 'openfin-layouts';
 *
 * // Undock the current window (all are equivalent)
 * snapAndDock.undockWindow();
 * snapAndDock.undockWindow(fin.desktop.Window.getCurrent());   // Using 'v1' API
 * snapAndDock.undockWindow(fin.Window.getCurrentSync());       // Using 'v2' API
 *
 * // Undock a different window
 * snapAndDock.undockWindow({uuid: 'my-app', name: 'other-window'});
 * ```
 *
 * @param identity The window to undock, defaults to the current window
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the window specified by `identity` does not exist
 * @throws `Error`: If the window specified by `identity` has been de-registered
 */
export function undockWindow(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(SnapAndDockAPI.UNDOCK_WINDOW, parseIdentity(identity));
    });
}
/**
 * Will undock every window that is currently connected to a current window.
 *
 * This will completely disband the entire group, not just the windows directly touching `identity`.
 *
 * Has no effect if `identity` isn't currently snapped to any other window.
 *
 * ```ts
 * import {snapAndDock} from 'openfin-layouts';
 *
 * // Undock all windows attached to the current window (all are equivalent)
 * snapAndDock.undockGroup();
 * snapAndDock.undockGroup(fin.desktop.Window.getCurrent());   // Using 'v1' API
 * snapAndDock.undockGroup(fin.Window.getCurrentSync());       // Using 'v2' API
 *
 * // Undock all windows attached to a different window
 * snapAndDock.undockGroup({uuid: 'my-app', name: 'other-window'});
 * ```
 *
 * @param identity A window belonging to the group that should be disbanded, defaults to the current window/group
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the window specified by `identity` does not exist
 * @throws `Error`: If the window specified by `identity` has been de-registered
 */
export function undockGroup(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(SnapAndDockAPI.UNDOCK_GROUP, parseIdentity(identity));
    });
}
/**
 * Returns an array representing the entities docked with the provided window (see {@link DockGroup} for more details).
 *
 * If the window is not docked returns null.
 *
 * ```ts
 * import {snapAndDock} from 'openfin-layouts';
 *
 * // Gets all tabs for the current window context.
 * const myGroup: DockGroup | null = snapAndDock.getDockedWindows();
 *
 * // Get all tabs for another window context.
 * const otherWindow: Identity = {uuid: "sample-window-uuid", name: "sample-window-name"}
 * const otherWindowGroup: DockGroup | null = snapAndDock.getDockedWindows(otherWindow);
 * ```
 *
 * @param identity The window context, defaults to the current window.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the window specified by `identity` does not exist
 * @throws `Error`: If the window specified by `identity` has been de-registered
 * @throws `Error`: If the provider is running an incompatible version
 *
 * @since 1.0.3
 */
export function getDockedWindows(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield tryServiceDispatch(SnapAndDockAPI.GET_DOCKED_WINDOWS, parseIdentity(identity));
        // @ts-ignore Compatability check. Provider will return false on unregistered actions.
        if (response === false) {
            console.warn('Warning: The currently running layouts service does not support the "getDockedWindows" method.');
            return null;
        }
        return response;
    });
}
