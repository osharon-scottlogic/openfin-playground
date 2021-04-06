var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const STORE_UPDATED_TOPIC = `store:updated-${fin.me.identity.uuid}`;
const LAST_STATE = 'LAST_STATE';
const LAYOUT_STORE_KEY = 'layouts';
const SNAPSHOT_STORE_KEY = 'snapshots';
//no need to send any data, we just want to notify other windows so they can re-render
function publishUpdateEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        return fin.InterApplicationBus.publish(STORE_UPDATED_TOPIC, '');
    });
}
function setLastState(template) {
    console.log('set-last-state', template);
    localStorage.setItem(LAST_STATE, JSON.stringify(template));
}
function getLastState() {
    try {
        return JSON.parse(localStorage.getItem(LAST_STATE) || '');
    }
    catch (err) {
        console.error(err, localStorage.getItem(LAST_STATE));
    }
    return {};
}
function storeTemplate(templateStoreKey, template) {
    const storedTemplates = getTemplates(templateStoreKey);
    storedTemplates.push(template);
    console.log('storing to', templateStoreKey);
    localStorage.setItem(templateStoreKey, JSON.stringify(storedTemplates));
    publishUpdateEvents();
}
function storeLayout(title) {
    return __awaiter(this, void 0, void 0, function* () {
        storeTemplate(LAYOUT_STORE_KEY, { title, template: yield fin.Platform.Layout.getCurrentSync().getConfig() });
    });
}
function storeSnapshot(title) {
    return __awaiter(this, void 0, void 0, function* () {
        storeTemplate(SNAPSHOT_STORE_KEY, { title, template: yield fin.Platform.getCurrentSync().getSnapshot() });
    });
}
function removeTemplate(templateStoreKey, templateName) {
    const storedTemplates = getTemplates(templateStoreKey);
    localStorage.setItem(templateStoreKey, JSON.stringify(storedTemplates.filter(i => i.name !== templateName)));
    publishUpdateEvents();
}
//Either returns a list of templates or an empty array.
function getTemplates(templateStoreKey) {
    const storedTemplates = localStorage.getItem(templateStoreKey);
    let storedTemplatesArr = [];
    if (storedTemplates) {
        storedTemplatesArr = Array.from(JSON.parse(storedTemplates));
    }
    return storedTemplatesArr;
}
function getLayouts() {
    return getTemplates(LAYOUT_STORE_KEY);
}
function getSnapshots() {
    return getTemplates(SNAPSHOT_STORE_KEY);
}
function getTemplateByName(templateStoreKey, name) {
    const templates = getTemplates(templateStoreKey);
    return templates.find(i => i.name === name);
}
//no concept of unsubcribing from these events.
function onStoreUpdate(callback) {
    fin.InterApplicationBus.subscribe({ uuid: '*' }, STORE_UPDATED_TOPIC, callback);
}
export { setLastState, getLastState, storeLayout, storeSnapshot, getLayouts, getSnapshots, getTemplateByName, onStoreUpdate, removeTemplate };
