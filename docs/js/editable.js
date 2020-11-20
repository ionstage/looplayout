const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      height: 100%;
      position: fixed;
      width: 100%;
    }
  </style>
`;

class Editable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('looplayout-editable', Editable);
