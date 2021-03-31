var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const CONTAINER_ID = 'layout-container';
const HEADER_MIN_HEIGHT = 4;
const HEADER_DEFAULT_HEIGHT = 25;
let isMainWindow = false;
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const layout = yield fin.Platform.Layout.init({ containerId: CONTAINER_ID });
    isMainWindow = yield getIsMainWindow();
    if (isMainWindow) {
        initMainWindow();
    }
    else {
        initSecondaryWindow(layout);
    }
    (_a = document.querySelector('top-bar')) === null || _a === void 0 ? void 0 : _a.addEventListener('close', closeWindow);
}));
function initMainWindow() {
    document.body.setAttribute('data-main-window', 'true');
    fin.Window.getCurrentSync().on('close-requested', closeWindow);
}
function initSecondaryWindow(layout) {
    return __awaiter(this, void 0, void 0, function* () {
        const finWindow = fin.Window.getCurrentSync();
        finWindow.on('view-detached', handleLayoutUpdate);
        finWindow.on('view-attached', handleLayoutUpdate);
        finWindow.on('view-created', handleLayoutUpdate);
        finWindow.on('view-destroyed', handleLayoutUpdate);
        const config = Object.assign({}, yield layout.getConfig());
        if (hasSingleStackWithSingleTab(config)) {
            setLayoutToSingleTab(layout, config);
        }
    });
}
function handleLayoutUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        const layout = fin.Platform.Layout.getCurrentSync();
        const config = Object.assign({}, yield layout.getConfig());
        if (hasSingleStackWithSingleTab(config)) {
            setLayoutToSingleTab(layout, config);
        }
        else if (document.body.getAttribute('single-tab-window')) {
            setLayoutToMultipleTabs(layout, config);
        }
    });
}
function hasSingleStackWithSingleTab(config) {
    return config.content &&
        config.content[0].type === 'stack' &&
        config.content[0].content &&
        config.content[0].content.length;
}
function setLayoutToSingleTab(layout, config) {
    layout.replace(Object.assign(Object.assign({}, config), { dimensions: Object.assign(Object.assign({}, config.dimensions), { headerHeight: HEADER_MIN_HEIGHT }) }));
    setWindowTitle(getFirstPanelTitle(config));
    document.body.setAttribute('single-tab-window', 'true');
}
function setLayoutToMultipleTabs(layout, config) {
    layout.replace(Object.assign(Object.assign({}, config), { dimensions: Object.assign(Object.assign({}, config.dimensions), { headerHeight: HEADER_DEFAULT_HEIGHT }) }));
    setWindowTitle(document.title);
    document.body.removeAttribute('single-tab-window');
}
function getFirstPanelTitle(config) {
    return config.content &&
        config.content[0].type === 'stack' &&
        config.content[0].content &&
        config.content[0].content[0].title || document.title;
}
function setWindowTitle(newTitle) {
    const titleElm = document.getElementById('title');
    titleElm && (titleElm.innerHTML = newTitle);
}
function getIsMainWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield fin.Platform.getCurrentSync().getSnapshot();
        return (snapshot.windows.length === 1);
    });
}
function closeWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isMainWindow) {
            const snapshot = yield fin.Platform.getCurrentSync().getSnapshot();
            if (snapshot.windows.length > 1) {
                if (confirm("This will close all the windows.\nContinue?")) {
                    fin.Platform.getCurrentSync().quit();
                }
            }
            else {
                fin.Platform.getCurrentSync().quit();
            }
        }
        else {
            fin.me.close();
        }
    });
}
