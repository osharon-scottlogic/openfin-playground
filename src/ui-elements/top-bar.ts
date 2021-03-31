//@ts-ignore
import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

type FinMe = {
	close: Function;
	restore: Function;
	maximize: Function;
	minimize: Function;
	getState: () => Promise<string>;
};

class TopBar extends HTMLElement {
    LIGHT_THEME = 'light-theme';
    DARK_THEME = 'dark';

    constructor() {
        super();

        this.render();
       
        this.init();
    }

    async init() {
        const platform = fin.Platform.getCurrentSync();
        const bindedOnLayoutUpdate:()=>void = this.onLayoutUpdate.bind(this);

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
    }

    async onLayoutUpdate() {
        const layout = await fin.Platform.Layout.getCurrentSync().getConfig();
        const layoutControls = document.querySelector('.layout_controls') || document.createElement('div');

        if (layout.content?.length && (layout.content[0] as any).content.length > 1) {
            this.unlockLayout(layout);
            layoutControls.removeAttribute('hidden');
        } else {
            this.lockLayout(layout);
            layoutControls.setAttribute('hidden','hidden');
        }
    }

    async render() {
        const finMe = (fin.me as unknown as FinMe);

        const titleBar = html`
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
    }

    maxOrRestore = async () => {
        if (await (fin.me as unknown as FinMe).getState() === 'normal') {
            return await (fin.me as unknown as FinMe).maximize();
        }

        return (fin.me as unknown as FinMe).restore();
    }

    async toggleLockedLayout () {
        const oldLayout = await fin.Platform.Layout.getCurrentSync().getConfig();
        const { settings } = oldLayout;
        if(settings && settings.hasHeaders && settings.reorderEnabled) {
            this.lockLayout(oldLayout);
        } else {
            this.unlockLayout(oldLayout);
        }
    };

    async lockLayout(oldLayout:GoldenLayout.Config) {
        const { settings } = oldLayout;

        fin.Platform.Layout.getCurrentSync().replace({
            ...oldLayout,
            settings: {
                ...settings,
                hasHeaders: false,
                reorderEnabled: false
            }
        });
    }

    async unlockLayout(oldLayout:GoldenLayout.Config) {
        const { settings, dimensions } = oldLayout;

        fin.Platform.Layout.getCurrentSync().replace({
            ...oldLayout,
            settings: {
                ...settings,
                hasHeaders: true,
                reorderEnabled: true
            },
            dimensions: {
                ...dimensions,
                headerHeight: 25
            }
        });
    }

    toggleTheme = async () => {
        let themeName = this.DARK_THEME;
        if (!document.documentElement.classList.contains(this.LIGHT_THEME)) {
            themeName = this.LIGHT_THEME;
        }
        this.setTheme(themeName);
    }

    setTheme = async (theme:string) => {
        const root = document.documentElement;

        if (theme === this.LIGHT_THEME) {
            root.classList.add(this.LIGHT_THEME);

        } else {
            root.classList.remove(this.LIGHT_THEME);
        }

        const context = await fin.Platform.getCurrentSync().getWindowContext() || {};
        if (context.theme !== theme) {
            fin.Platform.getCurrentSync().setWindowContext({theme});
        }
    }
}

customElements.define('top-bar', TopBar);