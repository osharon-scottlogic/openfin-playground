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
import { storeTemplate } from './template-store.js';
import { FormDialog } from './form-dialog.js';
export class LayoutForm extends FormDialog {
    constructor() {
        super();
        this.saveAsTemplate = () => __awaiter(this, void 0, void 0, function* () {
            const nameField = this.querySelector('.template-name');
            if (!nameField) {
                return;
            }
            const name = nameField.value;
            const templateObject = {
                name,
                layout: Object.assign(Object.assign({}, (yield fin.Platform.Layout.getCurrentSync().getConfig())), { title: name })
            };
            storeTemplate(this.templateStorageKey, templateObject);
            this.toggleVisibility();
            return;
        });
        this.render = () => {
            const layoutMenu = html `
            <div class="center-form">
                <fieldset>
                     <legend>Save the current Views in this Window as a Layout template</legend>
                     <input type="text" class="template-name" size="50"
                         value="New Layout"/> <br>
                     <button @click=${this.saveAsTemplate}>Save Layout</button>
                     <button @click=${this.cancel}>Cancel</button>
                 </fieldset>
             </div>`;
            return render(layoutMenu, this);
        };
        this.templateStorageKey = this.constructor.name;
        this.render();
    }
}
customElements.define('layout-form', LayoutForm);
