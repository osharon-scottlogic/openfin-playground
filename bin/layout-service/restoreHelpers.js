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
 * A simple restore handler that can be passed to {@link setRestoreHandler} when no custom logic is needed.
 *
 * This restore handler will open any child windows which are not currently running,
 * and move new and existing child windows to their expected positions for the workspace being restored.
 *
 * ``` ts
 * import {workspaces, restoreHelpers} from 'openfin-layouts';
 *
 * workspaces.setRestoreHandler(restoreHelpers.standardRestoreHandler);
 * ```
 *
 * @param workspaceApp Describes the running app's child windows and their expected post-restore state.
 * See {@link WorkspaceApp} and {@link setRestoreHandler} for more information on what this will contain.
 */
export function standardRestoreHandler(workspaceApp) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        const openWindows = yield fin.Application.getCurrentSync().getChildWindows();
        // Iterate through the child windows of the WorkspaceApp
        const opened = workspaceApp.childWindows.map((win) => __awaiter(this, void 0, void 0, function* () {
            // Check if the window already exists
            if (!openWindows.some(w => w.identity.name === win.name)) {
                // Create the OpenFin window based on the data in the workspaceApp
                return createChild(win).catch((e) => {
                    errors.push(e);
                });
            }
            else {
                // Only position if the window exists
                return positionChild(win).catch((e) => {
                    errors.push(e);
                });
            }
        }));
        // Wait for all windows to open and be positioned before returning
        yield Promise.all(opened);
        if (errors.length === 0) {
            return workspaceApp;
        }
        else {
            // Consolidate any errors in restoring the children into a single error
            throw new Error('One or more errors encountered when restoring children: ' + errors.map(e => e.message).join(', '));
        }
    });
}
/**
 * An additional helper function that can be used to create custom restore handlers.
 *
 * Given a {@link WorkspaceWindow} it will determine if the window is open and then
 * call {@link createChild} or {@link positionChild} as appropriate.
 *
 * @param workspaceWindow Object containing details of the window identity and how it should
 * be positioned/created.
 */
export function createOrPositionChild(workspaceWindow) {
    return __awaiter(this, void 0, void 0, function* () {
        const openWindows = yield fin.Application.getCurrentSync().getChildWindows();
        if (!openWindows.some(w => w.identity.name === workspaceWindow.name)) {
            // create the OpenFin window based on the data in the workspaceApp
            return createChild(workspaceWindow);
        }
        else {
            // only position if the window exists
            return positionChild(workspaceWindow);
        }
    });
}
/**
 * Given a {@link WorkspaceWindow} for a non-open window, this function will create the window, position it,
 * and update its visibility, state, and frame to fit with the restoring workspace.
 *
 * Called by the {@link standardRestoreHandler} for any non-open windows in the WorkspaceApp.
 *
 * @param workspaceWindow Object containing details of the window identity and how it should
 * be created.
 *
 * @throws `Error`: If there is an existing child window with the same name.
 */
export function createChild(workspaceWindow) {
    return __awaiter(this, void 0, void 0, function* () {
        const { bounds, frame, isShowing, name, state, url } = workspaceWindow;
        yield fin.Window.create({
            url,
            autoShow: isShowing,
            defaultHeight: bounds.height,
            defaultWidth: bounds.width,
            defaultLeft: bounds.left,
            defaultTop: bounds.top,
            frame,
            state,
            name
        });
    });
}
/**
 * Given a {@link WorkspaceWindow} object for a currently open window, this will position and
 * update the visibility, state and frame of that window to fit with the restoring
 * workspace.
 *
 * Called by the {@link standardRestoreHandler} for any currently running windows in the workspace.
 *
 * @param workspaceWindow Object containing details of the window identity and how it should
 * be positioned.
 *
 * @throws `Error`: If the window described by `workspaceWindow` is not currently running.
 */
export function positionChild(workspaceWindow) {
    return __awaiter(this, void 0, void 0, function* () {
        const { bounds, frame, isShowing, state, isTabbed } = workspaceWindow;
        const ofWin = fin.Window.wrapSync(workspaceWindow);
        yield ofWin.setBounds(bounds);
        if (isTabbed) {
            return;
        }
        if (!isShowing) {
            yield ofWin.hide();
            return;
        }
        if (state === 'normal') {
            yield ofWin.restore();
        }
        else if (state === 'minimized') {
            yield ofWin.minimize();
        }
        else if (state === 'maximized') {
            yield ofWin.maximize();
        }
        return ofWin.updateOptions({ frame });
    });
}
