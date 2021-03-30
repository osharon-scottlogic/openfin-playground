var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LAYOUT_STORE_KEY, SNAPSHOT_STORE_KEY } from './index.js';
import { getTemplateByName, getTemplates } from './template-store.js';
function toGrid() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fin.Platform.Layout.getCurrentSync().applyPreset({
            presetType: 'grid'
        });
    });
}
function toTabbed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fin.Platform.Layout.getCurrentSync().applyPreset({
            presetType: 'tabs'
        });
    });
}
function toRows() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fin.Platform.Layout.getCurrentSync().applyPreset({
            presetType: 'rows'
        });
    });
}
function replaceLayoutFromTemplate(templateName) {
    return __awaiter(this, void 0, void 0, function* () {
        const templates = getTemplates(LAYOUT_STORE_KEY);
        const templateToUse = templates.find(i => i.name === templateName);
        if (!templateToUse) {
            console.error('template not found: ', templateName);
            return;
        }
        fin.Platform.Layout.getCurrentSync().replace(templateToUse.layout);
    });
}
function applySnapshotFromTemplate(templateName) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = getTemplateByName(SNAPSHOT_STORE_KEY, templateName);
        return template && applySnapshot(template);
    });
}
function applySnapshot(template) {
    return __awaiter(this, void 0, void 0, function* () {
        return fin.Platform.getCurrentSync().applySnapshot(template.snapshot, {
            closeExistingWindows: template.close
        });
    });
}
function tearOutLayout(templateName) {
    return __awaiter(this, void 0, void 0, function* () {
        const templateToUse = getTemplates(LAYOUT_STORE_KEY).find(i => i.name === templateName);
        if (!templateToUse) {
            console.error('template not found: ', templateName);
            return;
        }
        //@ts-ignore
        const view = yield fin.Platform.getCurrentSync().createView({ show: false, url: location.href.replace(/index/, 'child-window') });
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            const viewWindow = yield view.getCurrentWindow();
            //@ts-ignore
            const layout = yield viewWindow.getLayout();
            layout.replace(templateToUse.layout);
            view.show();
        }), 500);
        return view;
    });
}
export { toGrid, toTabbed, toRows, replaceLayoutFromTemplate, applySnapshot, applySnapshotFromTemplate, tearOutLayout };
