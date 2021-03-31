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
import { getId, parseIdentity, TabAPI } from './internal.js';
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
 * Returns array of window identity references for tabs belonging to the tab group of the provided window context.
 *
 * If there is no tab group associated with the window context, will resolve to null.
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Gets all tabs for the current window context.
 * tabbing.getTabs();
 *
 * // Get all tabs for another window context.
 * tabbing.getTabs({uuid: "sample-window-uuid", name: "sample-window-name"});
 * ```
 *
 * @param identity The window context, defaults to the current window.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 */
export function getTabs(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.GETTABS, { name: identity.name, uuid: identity.uuid });
    });
}
/**
 * Creates the custom tabstrip + configuration for the entire application.  An application cannot have different windows using different tabstrip UIs.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * tabbing.setTabstrip({url: 'https://localhost/customTabstrip.html', height: 60});
 * ```
 *
 * @param config The {@link ApplicationUIConfig| Application UI Configuration} object.
 * @throws `Error`: If `config` is not a valid {@link ApplicationUIConfig}
 * @throws `Error`: If `config.url` is not a valid URL/URI.
 */
export function setTabstrip(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config || isNaN(config.height) || !config.url.length) {
            return Promise.reject(new Error('Invalid config provided'));
        }
        try {
            // tslint:disable-next-line:no-unused-expression We're only checking a valid URL was provided.  No need to assign the resulting object.
            new URL(config.url);
        }
        catch (e) {
            return Promise.reject(e);
        }
        return tryServiceDispatch(TabAPI.SETTABSTRIP, { id: getId(), config });
    });
}
/**
 * Creates a tabgroup with the provided windows.  The first window in the set will be used to define the tab strips properties.  See {@link setTabstrip}.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * tabbing.createTabGroup([{uuid: "App1", name: "App1"}, {uuid: "App2", name: "App2"}, {uuid: "App3", name: "App3"}]);
 * ```
 *
 * @param identities Array of window {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identities} which will be added to the
 * new tab group.
 * @param activeTab The {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity} of the window to set as the active tab in
 * the group.  If not provided, the first tab in the tab group will be set as the active tab.
 * @throws `Error`: If one of the provided {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identities} is not valid.
 * @throws `Error`: If duplicate {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identities} are provided.
 * @throws `Error`: If the provided value is not an array or less than 2 windows identities were provided.
 */
export function createTabGroup(identities, activeTab) {
    return __awaiter(this, void 0, void 0, function* () {
        const onlyIdentities = identities.map(id => parseIdentity(id));
        const active = activeTab && parseIdentity(activeTab) || undefined;
        return tryServiceDispatch(TabAPI.CREATETABGROUP, { windows: onlyIdentities, activeTab: active });
    });
}
/**
 * Tabs two windows together.  If the targetWindow is already in a group, the tab will be added to that group.
 *
 * The added tab will be brought into focus.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Tab App1 to App2
 * tabbing.tabWindowToWindow({uuid: 'App1', name: 'App1'}, {uuid: 'App2', name: 'App2'});
 * ```
 *
 * @param windowToAdd The identity of the window to add to the tab group.
 * @param targetWindow The identity of the window to create a tab group on.
 * @throws `Error`: If the {@link ApplicationUIConfig| App Config} does not match between the target and window to add.
 * @throws `Error`: If the `targetWindow` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the `windowToAdd` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 */
export function tabWindowToWindow(windowToAdd, targetWindow) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.TAB_WINDOW_TO_WINDOW, {
            targetWindow: parseIdentity(targetWindow),
            windowToAdd: parseIdentity(windowToAdd)
        });
    });
}
/**
 * Removes the specified window context from its tab group.  This does not close the window.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Remove the window from its tab group.
 * tabbing.removeTab();
 *
 * // Remove another window from its tab group.
 * tabbing.removeTab({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to remove.  If no `Identity` is provided as an argument, the current window context will be used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` refers to a window that doesn't exist, or is deregistered from the service.
 */
export function removeTab(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.REMOVETAB, parseIdentity(identity));
    });
}
/**
 * Sets the window context as the active tab in its tab group.  Active tabs are brought to the front of the tab group and shown.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts'
 *
 * // Sets the current window as active in the tab group.
 * tabbing.setActiveTab()
 *
 * // Sets another window context as the active tab.
 * tabbing.setActiveTab({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to set as active.  If no `Identity` is provided as an argument the current window context will be used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` is not an existing tab in a tabstrip.
 */
export function setActiveTab(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.SETACTIVETAB, parseIdentity(identity));
    });
}
/**
 * Closes the tab for the window context and removes it from its associated tab group.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Closes the current window context tab.
 * tabbing.closeTab();
 *
 * // Closes another windows context tab.
 * tabbing.closeTab({uuid: 'App1', name: 'App1'});
 * ```
 *
 * Note that the `identity` doesn't need to be tabbed for this call to take effect - so long as the window is known with the service.
 *
 * @param identity Identity of the window context to close.  If no `Identity` is provided as an argument the current window context will be used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` refers to a window that doesn't exist, or is deregistered from the service.
 */
export function closeTab(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.CLOSETAB, parseIdentity(identity));
    });
}
/**
 * Minimizes the tab group for the window context.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Minimizes the tab group for the current window context.
 * tabbing.minimizeTabGroup();
 *
 * // Minimizes the tab group for another windows context.
 * tabbing.minimizeTabGroup({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to minimize the tab group for.  If no `Identity` is provided as an argument the current window context will be
 * used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` is not an existing tab in a tabstrip.
 */
export function minimizeTabGroup(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.MINIMIZETABGROUP, parseIdentity(identity));
    });
}
/**
 * Maximizes the tab group for the window context.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Maximizes the tab group for the current window context.
 * tabbing.maxmimizeTabGroup();
 *
 * // Maximizes the tab group for another windows context.
 * tabbing.maximizeTabGroup({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to maximize the tab group for.  If no `Identity` is provided as an argument the current window context will be
 * used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` is not an existing tab in a tabstrip.
 */
export function maximizeTabGroup(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.MAXIMIZETABGROUP, parseIdentity(identity));
    });
}
/**
 * Restores the tab group for the window context to its normal state.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Restores the tab group for the current window context.
 * tabbing.restoreTabGroup();
 *
 * // Restores the tab group for another windows context.
 * tabbing.restoreTabGroup({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to restore the tab group for.  If no `Identity` is provided as an argument the current window context will be
 * used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` is not an existing tab in a tabstrip.
 */
export function restoreTabGroup(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.RESTORETABGROUP, parseIdentity(identity));
    });
}
/**
 * Closes the tab group for the window context.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Closes the tab group for the current window context.
 * tabbing.closeTabGroup();
 *
 * // Closes the tab group for another windows context.
 * tabbing.closeTabGroup({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param identity Identity of the window context to close the tab group for.  If no `Identity` is provided as an argument the current window context will be
 * used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If `identity` is not an existing tab in a tabstrip.
 */
export function closeTabGroup(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.CLOSETABGROUP, parseIdentity(identity));
    });
}
/**
 * Updates a tab's properties. Properties for a tab include its title and icon when in a tab group.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Updating only some properties for the current window context.
 * tabbing.updateTabProperties({title: 'An Awesome Tab!'});
 *
 * // Update all properties for the current window context.
 * tabbing.updateTabProperties({title: 'An Awesome Tab!', icon: 'http://openfin.co/favicon.ico'});
 *
 * // Update properties for another windows context.
 * tabbing.updateTabProperties({title: 'An Awesome Tab'}, {uuid: 'App1', name: 'App1'});
 * ```
 * @param properties Properties object for the tab to consume.
 * @param identity Identity of the window context set the properties on.  If no `Identity` is provided as an argument the current window context will be used.
 * @throws `Error`: If `identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 */
export function updateTabProperties(properties, identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!properties) {
            throw new Error("Properties are required" /* PROPERTIES_REQUIRED */);
        }
        return tryServiceDispatch(TabAPI.UPDATETABPROPERTIES, { window: parseIdentity(identity), properties });
    });
}
/**
 * Adds the provided window context as a tab to the current window context.
 *
 * The added tab will be brought into focus.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Tab App2 to current window.
 * tabbing.tabToSelf({uuid: 'App2', name: 'App2'});
 * ```
 *
 * @param Identity The identity of the window to add as a tab.
 * @throws `Error`: If the {@link ApplicationUIConfig| App Config} does not match between the window to add and the current window context.
 * @throws `Error`: If the `Identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the `Identity` matches the calling windows `Identity`.
 */
export function tabToSelf(identity) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.TAB_WINDOW_TO_WINDOW, { targetWindow: getId(), windowToAdd: parseIdentity(identity) });
    });
}
/**
 * Adds the current window context as a tab to the provided window context.
 *
 * The added tab will be brought into focus.
 *
 * ```ts
 * import {tabbing} from 'openfin-layouts';
 *
 * // Tab current window to App1.
 * tabbing.tabSelfTo({uuid: 'App1', name: 'App1'});
 * ```
 *
 * @param Identity The identity of the window to add the current window context as a tab to.
 * @throws `Error`: If the {@link ApplicationUIConfig| App Config} does not match between the window to add and the current window context.
 * @throws `Error`: If the `Identity` is not a valid {@link https://developer.openfin.co/docs/javascript/stable/global.html#Identity | Identity}.
 * @throws `Error`: If the `Identity` matches the calling windows `Identity`.
 */
export function tabSelfTo(identity) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(TabAPI.TAB_WINDOW_TO_WINDOW, { targetWindow: parseIdentity(identity), windowToAdd: getId() });
    });
}
