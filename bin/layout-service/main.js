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
 * @module Index
 */
import { tryServiceDispatch } from './connection.js';
import { getId, parseIdentityRule, RegisterAPI } from './internal.js';
import * as snapAndDock from './snapanddock.js';
import * as tabbing from './tabbing.js';
import * as tabstrip from './tabstrip.js';
import * as workspaces from './workspaces.js';
import * as restoreHelpers from './restoreHelpers.js';
export { snapAndDock, tabbing, tabstrip, workspaces, restoreHelpers };
/**
 * Allows a window to opt-out of this service.
 *
 * This will disable *all* layouts-related functionality for the given window.
 *
 * Multiple windows can be deregistered at once by using regex patterns on `identity.uuid`/`identity.name`.
 *
 * This API can be used to programmatically override configuration set at an app-wide level, such as in the application manifest.
 *
 * ```ts
 * import {deregister} from 'openfin-layouts';
 *
 * // De-register the current window
 * deregister();
 *
 * // De-register a single named window
 * deregister({uuid: 'my-uuid', name: 'window'});
 *
 * // De-register multiple windows belonging to the same application
 * deregister({uuid: 'my-uuid', name: {expression: 'popup-.*'}});
 *
 * // De-register all windows belonging to an application, not matching a pattern
 * deregister({uuid: 'my-uuid', name: {expression: 'interactive-.*', invert: true}});
 * ```
 *
 * @param identity The window (or pattern of windows) to deregister, defaults to the current window
 */
export function deregister(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(RegisterAPI.DEREGISTER, parseIdentityRule(identity));
    });
}
/**
 * Allows a window to opt-in back to this service if previously deregistered.
 *
 * This will enable *all* layouts-related functionality for the given window unless alternative behaviors are set in the layout configuration.
 *
 * This API can be used to programmatically override configuration set at an app-wide level, such as in the application manifest.
 *
 * This API is provided to complement {@link deregister}, to allow programmatic override of default service behavior or configuration
 * specified in an application manifest. This API is not required or intended for initial opt-in of your application to the service,
 * which is achieved through the `"services"` attribute within an application manifest.
 *
 * ```ts
 * import {register} from 'openfin-layouts';
 *
 * // Register the current window
 * register();
 *
 * // Register a single named window
 * register({uuid: 'my-uuid', name: 'window'});
 *
 * // Register multiple windows belonging to the same application
 * register({uuid: 'my-uuid', name: {expression: 'interactive-.*'}});
 *
 * // Register all windows belonging to an application, not matching a pattern
 * register({uuid: 'my-uuid', name: {expression: 'popup-.*', invert: true}});
 * ```
 *
 * @param identity The window (or pattern of windows) to register, defaults to the current window
 */
export function register(identity = getId()) {
    return __awaiter(this, void 0, void 0, function* () {
        return tryServiceDispatch(RegisterAPI.REGISTER, parseIdentityRule(identity));
    });
}
