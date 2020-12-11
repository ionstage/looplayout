import { content } from './content.js';
import { Main } from './main.js';
import { ScrollHandler } from './scroll-handler.js';

class App {
  constructor() {
    this.main = new Main({ element: document.querySelector('.main') });
    this.scrollHandler = new ScrollHandler({ onscroll: this.main.scroll.bind(this.main) });
  }

  get keyScrollAmount() {
    return 40 * this.main.fontSize;
  }

  load() {
    window.addEventListener('resize', this._debounce(this._resize.bind(this), 100));
    this._resize();
    return this.main.load(content).then(() => this.scrollHandler.enable());
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
    this.main.resize();
    this.scrollHandler.keyScrollAmount = this.keyScrollAmount;
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
