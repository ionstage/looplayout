export class Scene {
  constructor(props) {
    this.name = props.name;
    this.element = document.createElement('div');
    this.parentElement = null;
    this.left = 0;
    this.top = 0;
    this.scrollTop = 0;
    this.scrollHeight = props.scrollHeight;
    this.loadPromise = null;
    this.loaded = false;
    this.next = props.next;
    this.prev = props.prev;
    this.onchange = null;
  }

  setPosition(p) {
    this.left = p.left;
    this.top = p.top;
    this.element.style.transform = 'translate3d(' + this.left + 'em, ' + this.top + 'em, 0)';
  }

  load() {
    if (!this.loadPromise) {
      this.loadPromise = this._load();
    }
    return this.loadPromise;
  }

  loadComponents() {
    /* template */
    return Promise.resolve();
  }

  scrollBy(dtop) {
    const scrollTop = this.scrollTop + dtop;
    if (scrollTop >= this.scrollHeight) {
      this.scrollTop = this.scrollHeight;
      this.onscroll();
      this.onchange(this.next, scrollTop - this.scrollHeight);
    } else if (scrollTop < 0) {
      this.scrollTop = 0;
      this.onscroll();
      this.onchange(this.prev, scrollTop);
    } else {
      this.scrollTop = scrollTop;
      this.onscroll();
    }
  }

  scrollPosition(scrollTop) {
    /* template */
    return {
      left: 0,
      top: scrollTop,
    };
  }

  globalScrollPosition(localScrollTop) {
    const p = this.scrollPosition(localScrollTop);
    return {
      left: this.left + p.left,
      top: this.top + p.top,
    };
  }

  onscroll() {
    /* template */
  }

  _load() {
    this.element.className = 'scene hide';
    this.parentElement.appendChild(this.element);
    return this.loadComponents().then(() => this._onload());
  }

  _onload() {
    this.element.classList.remove('hide');
    this.loaded = true;
  }
}
