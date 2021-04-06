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
import { getLayouts, getSnapshots } from '../template-store.js';
const settings = {
    hasHeaders: true,
    reorderEnabled: false,
    showPopoutIcon: true,
    showMaximiseIcon: true,
    showCloseIcon: true
};
const navItems = [
    {
        title: 'Blotters',
        icon: 'fa-chart-bar',
        items: [
            { title: 'Trade finder', settings: Object.assign(Object.assign({}, settings), { hasHeaders: false }), content: [
                    {
                        type: "component",
                        componentName: "view",
                        componentState: {
                            processAffinity: "ps_1",
                            url: "http://localhost:5555/panels/trade-finder.html"
                        }
                    }
                ] },
            { title: 'Positions & trades', settings, content: [
                    {
                        type: 'stack',
                        content: [
                            {
                                type: "component",
                                componentName: "view",
                                componentState: {
                                    processAffinity: "ps_1",
                                    url: "http://localhost:5555/panels/preview-snapshot.html"
                                }
                            },
                            {
                                type: "component",
                                componentName: "view",
                                componentState: {
                                    processAffinity: "ps_1",
                                    url: "http://localhost:5555/panels/trade-finder.html"
                                }
                            }
                        ]
                    }
                ] },
            { title: 'Orders', badge: 3, settings, content: [] },
        ]
    },
    {
        title: 'Loaders',
        icon: 'fa-route',
        items: [
            { title: 'Trades', content: [] },
            { title: 'Orders', content: [] }
        ]
    }, {
        title: 'Options',
        icon: 'fa-sliders-h',
        items: [
            { title: 'ATM Vol Matrix', content: [] },
            { title: 'FXQ Axe Dock', content: [] }
        ]
    }
];
class SideBar extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.querySelectorAll('input').forEach(input => {
            input.addEventListener('click', (evt) => {
                input.checked = this.setSection(input.id);
                evt.stopPropagation();
            });
        });
        this.addEventListener('click', () => this.setSection(undefined));
        window.addEventListener('resize', () => this.setSection(undefined));
    }
    //@return false if no section is selected
    setSection(section) {
        const oldSection = this.section;
        if (this.section !== section) {
            this.section = section;
        }
        else {
            this.section = undefined;
        }
        // dispatch only if section toggled btween undefined and whatever else
        if (!oldSection !== !section) {
            this.dispatchEvent(new CustomEvent('toggle-panels-request', {
                detail: { show: !section }
            }));
        }
        return !!this.section;
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const layouts = getLayouts();
            const snapshots = getSnapshots();
            const menuItems = html `
				<h1 class="title-bar-draggable"><span>${document.title}</span></h1>
				
				${navItems.map(section => {
                const { title, icon } = section;
                return html `
					<input type="radio" hidden name="mobile-nav" id="nav_${title}" />
					<label for="nav_${title}"><i class="fas ${icon}"></i></label>
					<section>
							<h2>${title}</h2>
							<ul>
									${section.items.map(detail => html `
									<li>
										<a @click=${() => this.dispatchEvent(new CustomEvent('change-layout-request', { detail }))}>${detail.title}</a>${detail.badge ? html `<span class="badge">${detail.badge}</span>` : ''}
									</li>`)}
							</ul>
					</section>`;
            })}

				<input type="radio" hidden name="mobile-nav" id="nav_layouts" />
				<label for="nav_layouts"><i class="fas fa-window-maximize"></i></label>
				<section>
						<h2>Layouts</h2>
						<ul class="layouts">
							${layouts.map(layout => html `
							<li>
								<a @click=${() => this.dispatchEvent(new CustomEvent('change-layout-request', { detail: layout.template }))}>${layout.title}</a>
								<button><i class="fa fa-ellipsis-h"></i></button>
							</li>
							`)}
							<li><a href="#"  @click=${() => this.dispatchEvent(new CustomEvent('save-new-layout-request', { detail: `layout-${Math.random().toString(16).substr(2, 4)}` }))}>Save new Layout</a></li>
						</ul>
				</section>

				<input type="radio" hidden name="mobile-nav" id="nav_workspaces" />
				<label for="nav_workspaces"><i class="fas fa-desktop"></i></label>
				<section>
						<h2>Workspaces</h2>
						<ul class="snapshots">
							${snapshots.map(snapshot => html `
							<li>
								<a @click=${() => this.dispatchEvent(new CustomEvent('change-snapshot-request', { detail: snapshot.template }))}>${snapshot.title}</a>
								<button><i class="fa fa-ellipsis-h"></i></button>
							</li>
							`)}
							<li><a @click=${() => this.dispatchEvent(new CustomEvent('save-new-snapshot-request', { detail: `layout-${Math.random().toString(16).substr(2, 4)}` }))}>Save new Workspace</a></li>
						</ul>
				</section>
				`;
            return render(menuItems, this);
        });
    }
}
customElements.define('side-bar', SideBar);
export { SideBar };
