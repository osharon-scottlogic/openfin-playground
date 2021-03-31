var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
class TopBar extends HTMLElement {
    constructor() {
        super();
        this.LIGHT_THEME = 'light-theme';
        this.DARK_THEME = 'dark';
        this.maxOrRestore = () => __awaiter(this, void 0, void 0, function* () {
            if ((yield fin.me.getState()) === 'normal') {
                return yield fin.me.maximize();
            }
            return fin.me.restore();
        });
        this.toggleTheme = () => __awaiter(this, void 0, void 0, function* () {
            let themeName = this.DARK_THEME;
            if (!document.documentElement.classList.contains(this.LIGHT_THEME)) {
                themeName = this.LIGHT_THEME;
            }
            this.setTheme(themeName);
        });
        this.setTheme = (theme) => __awaiter(this, void 0, void 0, function* () {
            const root = document.documentElement;
            if (theme === this.LIGHT_THEME) {
                root.classList.add(this.LIGHT_THEME);
            }
            else {
                root.classList.remove(this.LIGHT_THEME);
            }
            const context = (yield fin.Platform.getCurrentSync().getWindowContext()) || {};
            if (context.theme !== theme) {
                fin.Platform.getCurrentSync().setWindowContext({ theme });
            }
        });
        this.render();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const platform = fin.Platform.getCurrentSync();
            const bindedOnLayoutUpdate = this.onLayoutUpdate.bind(this);
            fin.Application.getCurrentSync().addListener('started', (event) => {
                console.log('started', event);
                platform.getWindowContext().then(initialContext => {
                    bindedOnLayoutUpdate();
                    if (initialContext && initialContext.theme) {
                        this.setTheme(initialContext.theme);
                    }
                });
            });
            // platform.on('window-context-changed', async (evt) => {
            //     const context = await fin.Platform.getCurrentSync().getWindowContext();
            //     //we only want to react to events that include themes
            //     if (evt.context.theme && evt.context.theme !== context.theme) {
            //         this.setTheme(evt.context.theme);
            //     }
            // });
            // (fin.me as Frame).on('view-created', bindedOnLayoutUpdate);
            // (fin.me as Frame).on('view-destroyed', bindedOnLayoutUpdate);
        });
    }
    onLayoutUpdate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const layout = yield fin.Platform.Layout.getCurrentSync().getConfig();
            const layoutControls = document.querySelector('.layout_controls') || document.createElement('div');
            if (((_a = layout.content) === null || _a === void 0 ? void 0 : _a.length) && layout.content[0].content.length > 1) {
                this.unlockLayout(layout);
                layoutControls.removeAttribute('hidden');
            }
            else {
                this.lockLayout(layout);
                layoutControls.setAttribute('hidden', 'hidden');
            }
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const finMe = fin.me;
            const titleBar = html `
                <div class="title-bar-draggable">
                    <div id="title">{{Layout Name}}</div>
                </div>
                <div id="buttons-wrapper">
                    <div class="layout_controls" hidden>
                        <button title="Grid" class="layoutBtn_grid"><i class="fas fa-grip-horizontal"></i></button>
                        <button title="Tabs" class="layoutBtn_tab"><i class="fas fa-window-restore"></i></button>    
                        <button title="Rows" class="layoutBtn_row"><i class="fas fa-layer-group"></i></button>    
                        <button title="Toggle Layout Lock" class="button" @click=${this.toggleLockedLayout.bind(this)}><i class="fas fa-lock"></i></button>
                    </div>
                    <button hidden class="btn_toggleTheme" title="Toggle Theme" id="theme-button" @click=${this.toggleTheme}></button>
                    <button class="btn_minWindow"title="Minimize Window" @click=${() => finMe.minimize().catch(console.error)}><i class="fas fa-window-minimize"></i></button>
                    <button class="btn_maxWindow" title="Maximize Window" @click=${() => this.maxOrRestore().catch(console.error)}><i class="fas fa-window-maximize"></i></button>
                    <button class="btn_closeWindow"title="Close Window" @click=${() => this.dispatchEvent(new Event('close'))}><i class="fas fa-times"></i></button>
                </div>`;
            return render(titleBar, this);
        });
    }
    toggleLockedLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            const oldLayout = yield fin.Platform.Layout.getCurrentSync().getConfig();
            const { settings } = oldLayout;
            if (settings && settings.hasHeaders && settings.reorderEnabled) {
                this.lockLayout(oldLayout);
            }
            else {
                this.unlockLayout(oldLayout);
            }
        });
    }
    ;
    lockLayout(oldLayout) {
        return __awaiter(this, void 0, void 0, function* () {
            const { settings } = oldLayout;
            fin.Platform.Layout.getCurrentSync().replace(Object.assign(Object.assign({}, oldLayout), { settings: Object.assign(Object.assign({}, settings), { hasHeaders: false, reorderEnabled: false }) }));
        });
    }
    unlockLayout(oldLayout) {
        return __awaiter(this, void 0, void 0, function* () {
            const { settings, dimensions } = oldLayout;
            fin.Platform.Layout.getCurrentSync().replace(Object.assign(Object.assign({}, oldLayout), { settings: Object.assign(Object.assign({}, settings), { hasHeaders: true, reorderEnabled: true }), dimensions: Object.assign(Object.assign({}, dimensions), { headerHeight: 25 }) }));
        });
    }
}
customElements.define('top-bar', TopBar);
