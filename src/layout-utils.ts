import { Snapshot } from "openfin/_v2/shapes/Platform";

type Layout = GoldenLayout.Config & {
	title: string,
	badge?: number,
};

async function setLayout(layout:GoldenLayout.Config) {
	await fin.Platform.Layout.getCurrentSync().replace(layout);
}

async function setSnapshot(snapshot:Snapshot ) {
	fin.Platform.getCurrentSync().applySnapshot(snapshot, {
		closeExistingWindows: true
	});
}

export { Layout, setLayout, setSnapshot };