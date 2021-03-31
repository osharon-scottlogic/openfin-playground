/**
 * @hidden
 */
/**
 * Cached window identity (@see getId)
 */
let id;
/**
 * The identity of the main application window of the service provider
 */
export const SERVICE_IDENTITY = {
    uuid: 'layouts-service',
    name: 'layouts-service'
};
/**
 * Name of the IAB channel use to communicate between client and provider
 */
export const SERVICE_CHANNEL = 'of-layouts-service-v1';
/**
 * Returns the identity of the window that is calling these functions
 */
export function getId() {
    if (!id) {
        id = parseIdentity(fin.Window.me);
    }
    return id;
}
/**
 * Returns an Identity from a complete window object.  Useful to remove only the Identity instead of sending through a whole window context.
 *
 * Assumed that the supplied object has uuid & name.
 */
export function parseIdentity(identity) {
    if (identity === null || typeof identity !== 'object') {
        throw new Error("Invalid arguments. Must pass an identity object" /* IDENTITY_REQUIRED */);
    }
    const uuidCheck = typeof identity.uuid === 'string';
    const nameCheck = !identity.name || typeof identity.name === 'string';
    if (!uuidCheck && !nameCheck) {
        throw new Error("Invalid Identity provided: uuid and name must be strings" /* INVALID_IDENTITY_BOTH */);
    }
    else if (!uuidCheck) {
        throw new Error("Invalid Identity provided: uuid must be a string" /* INVALID_IDENTITY_UUID */);
    }
    else if (!nameCheck) {
        throw new Error("Invalid Identity provided: name must be a string or undefined" /* INVALID_IDENTITY_NAME */);
    }
    return { uuid: identity.uuid, name: identity.name || identity.uuid };
}
/**
 * Like parseIdentity above, but also allows properties to be regex objects.
 */
export function parseIdentityRule(identity) {
    if (identity === null || typeof identity !== 'object') {
        throw new Error("Invalid arguments. Must pass an identity object" /* IDENTITY_REQUIRED */);
    }
    const uuidCheck = typeof identity.uuid === 'string' || isRegex(identity.uuid);
    const nameCheck = !identity.name || typeof identity.name === 'string' || isRegex(identity.name);
    if (!uuidCheck && !nameCheck) {
        throw new Error("Invalid Identity provided: uuid and name must be strings or RegEx objects" /* INVALID_IDENTITYRULE_BOTH */);
    }
    else if (!uuidCheck) {
        throw new Error("Invalid Identity provided: uuid must be a string or RegEx object" /* INVALID_IDENTITYRULE_UUID */);
    }
    else if (!nameCheck) {
        throw new Error("Invalid Identity provided: name must be a string, RegEx object, or undefined" /* INVALID_IDENTITYRULE_NAME */);
    }
    return { uuid: identity.uuid, name: identity.name || identity.uuid };
}
// tslint:disable-next-line:no-any This is a type guard, and so can take any object.
function isRegex(a) {
    return !!a.expression && typeof a.expression === 'string' && (a.flags === undefined || typeof a.flags === 'string') &&
        (a.invert === undefined || typeof a.invert === 'boolean');
}
export var TabAPI;
(function (TabAPI) {
    TabAPI["CREATETABGROUP"] = "CREATETABGROUP";
    TabAPI["SETTABSTRIP"] = "SETTABSTRIP";
    TabAPI["GETTABS"] = "GETTABS";
    TabAPI["TAB_WINDOW_TO_WINDOW"] = "TAB_WINDOW_TO_WINDOW";
    TabAPI["REMOVETAB"] = "REMOVETAB";
    TabAPI["SETACTIVETAB"] = "SETACTIVETAB";
    TabAPI["MINIMIZETABGROUP"] = "MINIMIZETABGROUP";
    TabAPI["MAXIMIZETABGROUP"] = "MAXIMIZETABGROUP";
    TabAPI["CLOSETABGROUP"] = "CLOSETABGROUP";
    TabAPI["RESTORETABGROUP"] = "RESTORETABGROUP";
    TabAPI["REORDERTABS"] = "REORDERTABS";
    TabAPI["STARTDRAG"] = "STARTDRAG";
    TabAPI["ENDDRAG"] = "ENDDRAG";
    TabAPI["UPDATETABPROPERTIES"] = "UPDATETABPROPERTIES";
    TabAPI["CLOSETAB"] = "CLOSETAB";
})(TabAPI || (TabAPI = {}));
export var WorkspaceAPI;
(function (WorkspaceAPI) {
    WorkspaceAPI["RESTORE_HANDLER"] = "SET-RESTORE-HANDLER";
    WorkspaceAPI["GENERATE_HANDLER"] = "SET-GENERATE-HANDLER";
    WorkspaceAPI["GENERATE_LAYOUT"] = "GENERATE-WORKSPACE";
    WorkspaceAPI["RESTORE_LAYOUT"] = "RESTORE-WORKSPACE";
    WorkspaceAPI["APPLICATION_READY"] = "WORKSPACE-APP-READY";
})(WorkspaceAPI || (WorkspaceAPI = {}));
export var SnapAndDockAPI;
(function (SnapAndDockAPI) {
    SnapAndDockAPI["UNDOCK_WINDOW"] = "UNDOCK-WINDOW";
    SnapAndDockAPI["UNDOCK_GROUP"] = "UNDOCK-GROUP";
    SnapAndDockAPI["GET_DOCKED_WINDOWS"] = "GET-DOCKED-WINDOWS";
})(SnapAndDockAPI || (SnapAndDockAPI = {}));
export var RegisterAPI;
(function (RegisterAPI) {
    RegisterAPI["REGISTER"] = "REGISTER";
    RegisterAPI["DEREGISTER"] = "DEREGISTER";
})(RegisterAPI || (RegisterAPI = {}));
