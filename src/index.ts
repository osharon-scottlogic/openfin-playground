import { Layout } from "openfin/_v2/api/platform/layout";

export const CONTAINER_ID = 'layout-container';

const HEADER_MIN_HEIGHT = 4;
const HEADER_DEFAULT_HEIGHT = 25;

let isMainWindow = false;

window.addEventListener('DOMContentLoaded', async () => {
	const layout = await fin.Platform.Layout.init({containerId: CONTAINER_ID});

	isMainWindow = await getIsMainWindow();
	if (isMainWindow) {
		initMainWindow();
	} else {
		initSecondaryWindow(layout);
	}

	document.querySelector('top-bar')?.addEventListener('close', closeWindow);
});

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

async function getIsMainWindow() {
	const snapshot = await fin.Platform.getCurrentSync().getSnapshot();
	return (snapshot.windows.length===1)
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