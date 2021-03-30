export const CONTAINER_ID = 'layout-container';

window.addEventListener('DOMContentLoaded', async () => {
	const layout = await fin.Platform.Layout.init({containerId: CONTAINER_ID});

	document.querySelector('main')?.addEventListener('scroll', (evt:Event) => {
		console.log('scrolling container', evt)
	});
});

window.addEventListener('scroll', (evt:Event) => {
	console.log('scrolling document', evt)
});

let columnCount = 2;

window.addEventListener('resize', () => {
	const minColumnWidth = 300;
	const newColumnCount = Math.floor(window.innerWidth / minColumnWidth);
	if (columnCount !== newColumnCount) {
		columnCount = newColumnCount;
		updateLayout(columnCount);
	}
});

async function updateLayout (columnCount:number) {
	console.log('updating to', columnCount, ' columns')
	const config = await fin.Platform.Layout.getCurrentSync().getConfig();
	const content:GoldenLayout.ItemConfigType[] = [
		{
			type: "row",
			content: []
		}
	];

	for (let i=0;i<columnCount;i++) {
		content[0].content?.push({
			type: "column",
			content: []
		})
	}

	if (config.content) {
		const row = config.content[0];
		row.content?.forEach((column,index)=>{
			const columnIdx = (index < columnCount) ? index: 0;
			//@ts-ignore
			const targetContainer = content[0].content[columnIdx];
			column.content?.forEach(stack => {
				if (stack.type!=='stack' || stack.content?.length) {
					console.log(`pushing items to ${columnIdx}`, stack);
					targetContainer.content?.push(stack)
				}
			});
		});
	}

	for (let i=0;i<columnCount;i++) {
		//@ts-ignore
		const column = content[0].content[i];
		if (!column.content?.length) {
			column.content?.push({ type: "stack"})
		}
	}

	fin.Platform.Layout.getCurrentSync().replace({ ... config, content});
}