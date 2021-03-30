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
class SideBar extends HTMLElement {
    constructor() {
        super();
        this.render = () => __awaiter(this, void 0, void 0, function* () {
            const menuItems = html `
        <h1 class="title-bar-draggable">${document.title}</h1>
        
        <h2>Blotters</h2>
        <ul>
            <li>Trade finder</li>
            <li>Positions &amp; trades</li>
            <li>Orders <span class="order-count">3</span></li>
        </ul>

        <h2>Loaders</h2>
        <ul>
            <li>Trades</li>
            <li>Orders</li>
        </ul>

        <h2>Options</h2>
        <ul>
            <li>ATM Vol Matrix</li>
            <li>FXQ Axe Dock</li>
        </ul>

        <h2>Saved Templates</h2>
        <ul class="layouts">
					<li>
						<a href="#">Template 1</a>
						<button><i class="fa fa-external-link-alt"></i></button>
						<button><i class="fa fa-external-trash"></i></button>
					</li>
        </ul>`;
            return render(menuItems, this);
        });
        this.render();
    }
}
customElements.define('side-bar', SideBar);
