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
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const layout = yield fin.Platform.Layout.init({ containerId: CONTAINER_ID });
    (_a = document.querySelector('main')) === null || _a === void 0 ? void 0 : _a.addEventListener('scroll', (evt) => {
        console.log('scrolling container', evt);
    });
}));
window.addEventListener('scroll', (evt) => {
    console.log('scrolling document', evt);
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
function updateLayout(columnCount) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('updating to', columnCount, ' columns');
        const config = yield fin.Platform.Layout.getCurrentSync().getConfig();
        const content = [
            {
                type: "row",
                content: []
            }
        ];
        for (let i = 0; i < columnCount; i++) {
            (_a = content[0].content) === null || _a === void 0 ? void 0 : _a.push({
                type: "column",
                content: []
            });
        }
        if (config.content) {
            const row = config.content[0];
            (_b = row.content) === null || _b === void 0 ? void 0 : _b.forEach((column, index) => {
                var _a;
                const columnIdx = (index < columnCount) ? index : 0;
                //@ts-ignore
                const targetContainer = content[0].content[columnIdx];
                (_a = column.content) === null || _a === void 0 ? void 0 : _a.forEach(stack => {
                    var _a, _b;
                    if (stack.type !== 'stack' || ((_a = stack.content) === null || _a === void 0 ? void 0 : _a.length)) {
                        console.log(`pushing items to ${columnIdx}`, stack);
                        (_b = targetContainer.content) === null || _b === void 0 ? void 0 : _b.push(stack);
                    }
                });
            });
        }
        for (let i = 0; i < columnCount; i++) {
            //@ts-ignore
            const column = content[0].content[i];
            if (!((_c = column.content) === null || _c === void 0 ? void 0 : _c.length)) {
                (_d = column.content) === null || _d === void 0 ? void 0 : _d.push({ type: "stack" });
            }
        }
        fin.Platform.Layout.getCurrentSync().replace(Object.assign(Object.assign({}, config), { content }));
    });
}
