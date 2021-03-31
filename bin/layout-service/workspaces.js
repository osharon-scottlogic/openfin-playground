var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { eventEmitter, getServicePromise, tryServiceDispatch } from './connection.js';
import { WorkspaceAPI } from './internal.js';
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
 * Register a callback that will save the state of the calling application.
 *
 * The callback will be invoked on each call to {@link generate}, and the return value (if anything is returned)
 * will be saved as the workspace's `customData` property for this app within the generated {@link Workspace}.
 *
 * ``` ts
 * import {workspaces} from 'openfin-layouts';
 *
 * workspaces.setGenerateHandler(() => {
 *     // Return custom data
 *     return {currentStockSymbol: this._currentStockSymbol};
 * });
 * ```
 *
 */
export function setGenerateHandler(customDataDecorator) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield getServicePromise();
        return channel.register(WorkspaceAPI.GENERATE_HANDLER, customDataDecorator);
    });
}
/**
 * Registers a callback that will restore the application to a previous state.
 *
 * If an application has set a {@link setRestoreHandler} callback, and called the {@link ready} function, the layouts service
 * will send it its Workspace data when the {@link restore} function is called, and wait for this function to return. If
 * an application has saved its child windows, it *MUST* create those child windows with the same names defined in its
 * Workspace. If those child windows are already up, position them in their proper location using the bounds given.
 *
 * If this function does not return, or this function does not create the app's child windows appropriately,
 * {@link restore} will hang indefinitely.
 *
 * If the callback does not return a WorkspaceApp object, window grouping will be affected. The {@link restore} function reads
 * the return value and uses it to continue restoration.
 *
 * It is recommended that you restore/position the child windows defined in workspaceApp, and after those windows have been created, return
 * that same workspaceApp object.
 *
 * ``` ts
 * import {workspaces} from 'openfin-layouts';
 * import {WorkspaceApp, WorkspaceWindow} from 'openfin-layouts/dist/client/workspaces';
 *
 * async function appRestoreHandler(workspaceApp: Workspace) {
 *     const ofApp = await fin.Application.getCurrent();
 *     const openWindows = await ofApp.getChildWindows();
 *     // Iterate through the child windows of the workspaceApp data
 *     const opened = workspaceApp.childWindows.map(async (childWinInfo: WorkspaceWindow, index: number) => {
 *         // Check for existence of the window
 *         let openChildWin = openWindows.find(w => w.identity.name === childWinInfo.name);
 *         if (!openChildWin) {
 *             openChildWin = await openChild(childWinInfo.name, childWinInfo.url);
 *         }
 *         // Create the OpenFin window with the same name
 *         // Position the window based on the data in the workspaceApp
 *         // The user provides this positioning function
 *         await positionWindow(childWinInfo, openChildWin);
 *     });
 *
 *     // Wait for all windows to open and be positioned before returning
 *     await Promise.all(opened);
 *     return layoutApp;
 * }
 *
 * workspaces.setRestoreHandler(appRestoreHandler);
 * ```
 */
export function setRestoreHandler(listener) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield getServicePromise();
        return channel.register(WorkspaceAPI.RESTORE_HANDLER, listener);
    });
}
/**
 * Generates a JSON Workspace object that contains the state of the current desktop.
 *
 * The returned JSON will contain information for the main window of every application that is currently open and hasn't
 * explicitly de-registered itself from the service. It will also contain positioning, tabbing and grouping information
 * for each application. This data will be passed to {@link restore}, which will create the applications and
 * position them appropriately.
 *
 * If an application wishes to restore its child windows and store custom data, it must properly integrate with the
 * layouts service by both registering {@link setGenerateHandler|generate} and {@link setRestoreHandler|restore} callbacks, and
 * calling the {@link ready} function. If this is not done properly, workspace restoration may be disrupted.
 *
 * ``` ts
 * import {workspaces} from 'openfin-layouts';
 * import {Workspace} from 'openfin-layouts/dist/client/workspaces';
 *
 * async function saveCurrentWorkspace() {
 *    const workspaceObject: Workspace = await workspaces.generate();
 *    // Persist the workspaceObject in a location of your choosing
 *    saveWorkspace(workspaceObject);
 *    return workspaceObject;
 * }
 * ```
 *
 */
export function generate() {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(WorkspaceAPI.GENERATE_LAYOUT);
    });
}
/**
 * Takes a Workspace object created by the {@link generate} function and restores the state of the desktop at the time it was generated
 *
 * Restoration begins by reading the Workspace object, and determining what applications and windows are running or not.
 *
 * If an application or child window is not up and running, the layouts service will create a transparent placeholder window for it, as an
 * indication to the user that a window is in the process of loading. The placeholder window will listen for its corresponding window to
 * come up, and subsequently close itself.
 *
 * Once all placeholder windows are up, the layouts service will ungroup and un-tab any windows participating in restoration. This is done to
 * prevent a window from dragging its group around the desktop, into a location that wasn't originally intended. Restore does not touch
 * any windows that were not declared in the Workspace object.
 *
 * Once all windows are ungrouped, the layouts service will then tab together all windows involved in a tabgroup. Placeholder windows are
 * included in this tabbing step. Once a placeholder window's corresponding restored window comes up, that restored window takes
 * the place of the placeholder window in the tabset.
 *
 * Once all groups have been set up, the layouts service will then begin opening and positioning the applications and windows.
 *
 * If an application is up and running, the layouts service will position it in its proper place. If the application isn't running,
 * the layouts service will attempt to launch it after it has been launched. It is then positioned.
 *
 * If the application has registered {@link setGenerateHandler|generate} and {@link setRestoreHandler|restore} callbacks, and called
 * the {@link ready} function, the layouts service will send it its Workspace data. If an application has saved its child windows,
 * it *MUST* create those child windows with the same names defined in its Workspace. If it does not do so, {@link restore} will fail.
 *
 * Once all applications and child windows have been spun up and positioned, and all placeholder windows have been closed, the layouts
 * service will then group all windows that were formerly snapped together.
 *
 * Finally, the layouts service will send a 'workspace-restored' event to all windows, and complete restoration.
 *
 * ``` ts
 * import {workspaces} from 'openfin-layouts';
 *
 * workspaces.restore(workspaceObject).then(result => {
 *    // Promise resolves with result once the layout has been restored
 *    handleResult(result);
 * });
 * ```
 *
 */
export function restore(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(WorkspaceAPI.RESTORE_LAYOUT, payload);
    });
}
/**
 * Send this to the service when you have registered all routes after registration.
 *
 * When restoring a workspace, the service will refrain from passing the saved workspace to the application (via the
 * {@link setRestoreHandler} callback) until after the application has used this function to signal that it is ready.
 *
 * Note that by not calling this function, and workspace {@link restore} operation will hang
 * indefinitely.
 *
 * ``` ts
 * import {workspaces} from 'openfin-layouts';
 *
 * workspaces.setRestoreHandler(someRestoreFunction);
 * workspaces.setGenerateHandler(someGenerateFunction);
 * workspaces.ready();
 * ```
 *
 */
export function ready() {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(WorkspaceAPI.APPLICATION_READY);
    });
}
