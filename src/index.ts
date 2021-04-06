import { Layout } from "openfin/_v2/api/platform/layout";
import { undockWindow, addEventListener } from './layout-service/snapanddock.js';
import { setLayout, setSnapshot } from "./layout-utils.js";
import { storeLayout, storeSnapshot} from './template-store.js';
import { SideBar } from './ui-elements/side-bar.js';
export const CONTAINER_ID = 'layout-container';

const HEADER_MIN_HEIGHT = 4;
const HEADER_DEFAULT_HEIGHT = 25;

let isMainWindow = false;

window.addEventListener('DOMContentLoaded', async () => {
	const layout = await fin.Platform.Layout.init({containerId: CONTAINER_ID});

	isMainWindow = await getIsMainWindow();
	if (isMainWindow) {
		initMainWindow();
		initSideBar();
	} else {
		initSecondaryWindow(layout);
	}

	initTopBar();
});

function initTopBar() {
	const topBarElm = document.querySelector('top-bar');
	if (topBarElm) {
		topBarElm.addEventListener('close', closeWindow);
		topBarElm.addEventListener('undock', ()=>undockWindow(fin.Window.getCurrentSync().identity));
	}
}

function initSideBar() {
	const sideBarElm = document.querySelector('side-bar');

	if (sideBarElm) {
		sideBarElm.addEventListener(
			'toggle-panels-request', 
			(evt:Event)=> toggleLayoutContainer((evt as CustomEvent).detail.show)
		);

		sideBarElm.addEventListener(
			'change-layout-request', 
			(evt:Event)=> setLayout((evt as CustomEvent).detail)
		);

		sideBarElm.addEventListener(
			'change-snapshot-request', 
			(evt:Event)=> setSnapshot((evt as CustomEvent).detail)
		);

		sideBarElm.addEventListener(
			'save-new-layout-request',
			async (evt:Event) => { await storeLayout((evt as CustomEvent).detail); (sideBarElm as SideBar).render() }
		);

		sideBarElm.addEventListener(
			'save-new-snapshot-request',
			async (evt:Event) => { await storeSnapshot((evt as CustomEvent).detail); (sideBarElm as SideBar).render() }
		);
	}
}

function toggleLayoutContainer(show:boolean) {
	const mainElm = document.querySelector('main');
			
	if (!mainElm) {
		return;
	}

	if (show) {
		mainElm.removeAttribute('hidden');
	} else {
		mainElm.setAttribute('hidden','true');
	}
}

function initMainWindow() {
	document.body.setAttribute('data-main-window','true');
	fin.Window.getCurrentSync().on('close-requested', closeWindow);
}

async function initSecondaryWindow(layout:Layout) {
	const finWindow = fin.Window.getCurrentSync();
	finWindow.on('view-detached', handleLayoutUpdate);
	finWindow.on('view-attached', handleLayoutUpdate);
	finWindow.on('view-created', handleLayoutUpdate);
	finWindow.on('view-destroyed', handleLayoutUpdate);
	addEventListener('window-docked', () => document.body.setAttribute('data-is-docked', 'true'));
	addEventListener('window-undocked', () => document.body.removeAttribute('data-is-docked'));

	const config = { ... await layout.getConfig() };
	if (hasSingleStackWithSingleTab(config)) {
		setLayoutToSingleTab(layout, config);
	}
}

async function handleLayoutUpdate() {
	const layout = fin.Platform.Layout.getCurrentSync();
	const config = { ... await layout.getConfig() };
	
	if (hasSingleStackWithSingleTab(config)) {
		setLayoutToSingleTab(layout, config);
	} else if (document.body.getAttribute('single-tab-window')) {
		setLayoutToMultipleTabs(layout, config)
	}
}

function hasSingleStackWithSingleTab(config:GoldenLayout.Config) {
	return config.content &&
		config.content[0].type==='stack' &&
		config.content[0].content &&
		config.content[0].content.length;
}

function setLayoutToSingleTab(layout:Layout, config:GoldenLayout.Config) {
	layout.replace({
		...config,
		dimensions: {
			...config.dimensions,
			headerHeight: HEADER_MIN_HEIGHT
		}
	});
	setWindowTitle(getFirstPanelTitle(config));
	document.body.setAttribute('single-tab-window','true');
}

function setLayoutToMultipleTabs(layout:Layout, config:GoldenLayout.Config) {
	layout.replace({
		...config,
		dimensions: {
			...config.dimensions,
			headerHeight: HEADER_DEFAULT_HEIGHT
		}
	});
	setWindowTitle(document.title);
	document.body.removeAttribute('single-tab-window');
}

function getFirstPanelTitle(config:GoldenLayout.Config) {
	return config.content &&
	config.content[0].type==='stack' &&
	config.content[0].content &&
	config.content[0].content[0].title || document.title;
}

function setWindowTitle(newTitle:string) {
	const titleElm = document.getElementById('title');
	titleElm && (titleElm.innerHTML = newTitle);
}

// Sadly, the only way I could find what is the main window is by checking its position on the screen
async function getIsMainWindow() {
	const snapshot = await fin.Platform.getCurrentSync().getSnapshot();
	const { top, left } = await fin.Window.getCurrentSync().getBounds();

	return (top === snapshot.windows[0].y &&left === snapshot.windows[0].x);
}

async function closeWindow() {
	if (isMainWindow){
		const snapshot = await fin.Platform.getCurrentSync().getSnapshot();
		if(snapshot.windows.length > 1) {
			if (confirm("This will close all the windows.\nContinue?")) {
				fin.Platform.getCurrentSync().quit();
			}
		} else {
			fin.Platform.getCurrentSync().quit();
		}
	} else {
		(fin.me as Window).close();
	}
}