import { Content } from './content.js';
import { ScrollHandler } from './scroll-handler.js';

class App {
  constructor() {
    this.content = new Content();
    this.scrollHandler = new ScrollHandler({ onscroll: this.content.scroll.bind(this.content) });
  }

  load() {
    this.content.init();
    this.scrollHandler.enable();
  }

  editable() {
    const f = new Function("return import('./editable.js')");
    return f().then(() => document.body.appendChild(document.createElement('looplayout-editable')));
  }
}

const main = () => {
  const app = new App();
  app.load();

  if (location.hostname === 'localhost') {
    app.editable();
  }
};

main();
