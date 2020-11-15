import { Content } from './content.js';
import { ScrollHandler } from './scroll-handler.js';

class App {
  constructor() {
    this.content = new Content();
    this.scrollHandler = new ScrollHandler({ onscroll: this.content.scroll.bind(this.content) });
  }

  init() {
    this.content.init();
    this.scrollHandler.enable();
  }

  editable() { /* TODO */ }
}

const main = () => {
  const app = new App();
  app.init();

  if (location.hostname === 'localhost') {
    app.editable();
  }
};

main();
