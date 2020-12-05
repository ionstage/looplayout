import { Content } from './content.js';
import { ContentData } from './content-data.js';
import { ScrollHandler } from './scroll-handler.js';

class App {
  constructor() {
    this.content = new Content();
    this.scrollHandler = new ScrollHandler({ onscroll: this.content.scroll.bind(this.content) });
  }

  load() {
    return this.content.load(ContentData).then(() => {
      this.scrollHandler.enable();
    });
  }
}

const main = () => {
  const app = new App();
  app.load();

  if (location.hostname === 'localhost') {
    window.app = app;
  }
};

main();
