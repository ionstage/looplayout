class SceneProxy {
  constructor(props) {
    this.parentElement = props.parentElement;
    this.scenes = [];
    this.sceneMap = {};
    this.current = null;
    this._onchange = this._onchange.bind(this);
  }

  load(data) {
    this.scenes = data.scenes.map(scene => (this.sceneMap[scene.name] = scene));
    this._loadScenes();
    this.current = this.scenes[0];
    return this.current.load();
  }

  scrollBy(dtop) {
    this.current.scrollBy(dtop);
  }

  scrollPosition() {
    return this.current.globalScrollPosition(this.current.scrollTop);
  }

  _loadScenes() {
    return Promise.all(this.scenes.map(scene => this._loadScene(scene)));
  }

  _loadScene(scene) {
    const prev = this.sceneMap[scene.prev];
    if (prev) {
      scene.setPosition(prev.globalScrollPosition(prev.scrollHeight));
    }
    scene.parentElement = this.parentElement;
    scene.onchange = this._onchange;
    return scene.load();
  }

  _onchange(name, dtop) {
    if (!name) {
      return;
    }
    const s = this.sceneMap[name];
    if (!s.loaded) {
      s.load();
      return;
    }
    s.scrollTop = (dtop >= 0 ? dtop : s.scrollHeight + dtop);
    this.current = s;
  }
}

export class Content {
  constructor() {
    this.element = document.querySelector('.content');
    this.fontSize = 1;
    this.scene = new SceneProxy({ parentElement: this.element });
  }

  load(data) {
    window.addEventListener('resize', this._debounce(this._resize.bind(this), 100));
    this._resize();
    return this.scene.load(data).then(() => this._moveByScene());
  }

  scroll(_, dy) {
    if (!dy) {
      return;
    }
    const dtop = dy / this.fontSize;
    this.scene.scrollBy(dtop);
    this._moveByScene();
  }

  _calcCenter() {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  _calcFontSize() {
    const c = this._calcCenter();
    return Math.sqrt(c.x * c.x + c.y * c.y) / 300;
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

  _move(left, top) {
    const t = 'translate3d(' + -this._round(left) + 'em, ' + -this._round(top) + 'em, 0)';
    this.element.style.transform = t;
  }

  _moveByScene() {
    const p = this.scene.scrollPosition();
    this._move(p.left, p.top);
  }

  _resize() {
    const c = this._calcCenter();
    this.element.style.padding = c.y + 'px ' + c.x + 'px';
    this.fontSize = this._calcFontSize();
    this.element.style.fontSize = this._round(this.fontSize) + 'px';
  }

  _round(n) {
    return Math.round(n * 100) / 100;
  }
}
