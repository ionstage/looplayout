const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      bottom: 0;
      height: 48px;
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
