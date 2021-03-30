//@ts-ignore
import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

class SideBar extends HTMLElement {
    snapshotForm!:HTMLFormElement;
    layoutForm!:HTMLFormElement;
    layoutContainer!:HTMLElement;

    constructor() {
        super();
        this.render();
    }

    render = async () => {
        const menuItems = html`
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
    }
}

customElements.define('side-bar', SideBar);
