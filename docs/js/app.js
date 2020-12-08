import { Content } from './content.js';
import { ContentData } from './content-data.js';
import { ScrollHandler } from './scroll-handler.js';

class App {
  constructor() {
    this.content = new Content();
    this.scrollHandler = new ScrollHandler({ onscroll: this.content.scroll.bind(this.content) });
  }

  load() {
    window.addEventListener('resize', this._debounce(this._resize.bind(this), 100));
    this._resize();
    return this.content.load(ContentData).then(() => {
      this.scrollHandler.enable();
    });
  }

  _debounce(func, delay) {
    let t = 0;
    return () => {
      if (t) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        func();
        t = 0;
      }, delay);
    };
  }

  _resize() {
    this.content.resize();
    this.scrollHandler.keyScrollAmount = 40 * this.content.fontSize;
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
