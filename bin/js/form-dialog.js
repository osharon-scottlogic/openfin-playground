export class FormDialog extends HTMLElement {
    constructor() {
        super(...arguments);
        this.hideElement = () => {
            this.classList.add('hidden');
        };
        this.showElement = () => {
            this.classList.remove('hidden');
        };
        this.toggleVisibility = () => {
            this.classList.toggle('hidden');
            const layoutContainerElm = document.querySelector('#layout-container');
            layoutContainerElm && layoutContainerElm.classList.toggle('hidden');
        };
        this.cancel = () => {
            this.toggleVisibility();
        };
    }
}
