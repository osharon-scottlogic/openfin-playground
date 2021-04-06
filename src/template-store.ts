import { Frame } from 'openfin/_v2/main';

const STORE_UPDATED_TOPIC = `store:updated-${(fin.me as Frame).identity.uuid}`;
const LAST_STATE = 'LAST_STATE';
const LAYOUT_STORE_KEY ='layouts';
const SNAPSHOT_STORE_KEY ='snapshots';

export type Template = {
	title: string
	[key:string]:any,
};

//no need to send any data, we just want to notify other windows so they can re-render
async function publishUpdateEvents() {
	return fin.InterApplicationBus.publish(STORE_UPDATED_TOPIC, '');
}

function setLastState(template:Template) {
    console.log('set-last-state', template);
    localStorage.setItem(LAST_STATE, JSON.stringify(template));
}

function getLastState() {
    try {
        return JSON.parse(localStorage.getItem(LAST_STATE) || '');
    } catch(err) {
        console.error(err, localStorage.getItem(LAST_STATE))
    }
    return {};
}

function storeTemplate(templateStoreKey:string, template:Template) {
    const storedTemplates = getTemplates(templateStoreKey);
    storedTemplates.push(template);
		console.log('storing to', templateStoreKey);
    localStorage.setItem(templateStoreKey, JSON.stringify(storedTemplates));

    publishUpdateEvents();
}

async function storeLayout(title:string) {
	storeTemplate(LAYOUT_STORE_KEY, { title, template: await fin.Platform.Layout.getCurrentSync().getConfig() })
}

async function storeSnapshot(title:string) {
	storeTemplate(SNAPSHOT_STORE_KEY, { title, template: await fin.Platform.getCurrentSync().getSnapshot() })
}

function removeTemplate(templateStoreKey:string, templateName:string) {

    const storedTemplates = getTemplates(templateStoreKey);
    localStorage.setItem(
        templateStoreKey,
        JSON.stringify(storedTemplates.filter(i=>i.name!==templateName))
    );

    publishUpdateEvents();
}

//Either returns a list of templates or an empty array.
function getTemplates(templateStoreKey:string) {
    const storedTemplates = localStorage.getItem(templateStoreKey);
    let storedTemplatesArr:Template[] = [];
    if (storedTemplates) {
        storedTemplatesArr = Array.from(JSON.parse(storedTemplates)) as Template[];
    }

    return storedTemplatesArr;
}

function getLayouts() {
	return getTemplates(LAYOUT_STORE_KEY);
}

function getSnapshots() {
	return getTemplates(SNAPSHOT_STORE_KEY);
}

function getTemplateByName(templateStoreKey:string, name:string) {
    const templates = getTemplates(templateStoreKey);

    return templates.find(i => i.name === name);
}

//no concept of unsubcribing from these events.
function onStoreUpdate(callback:Function) {
    fin.InterApplicationBus.subscribe({ uuid: '*' }, STORE_UPDATED_TOPIC, callback);
}

export { setLastState, getLastState, storeLayout, storeSnapshot , getLayouts, getSnapshots, getTemplateByName, onStoreUpdate, removeTemplate };
