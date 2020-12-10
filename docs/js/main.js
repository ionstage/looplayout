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
    this.current = this.scenes[0];
    this._setScenesPosition();
    return this._loadScenes();
  }

  scrollBy(dtop) {
    this.current.scrollBy(dtop);
  }

  scrollPosition() {
    return this.current.globalScrollPosition(this.current.scrollTop);
  }

  _loadScenes() {
    // load all scenes and wait for only first one
    return this.scenes.map(scene => scene.load(this.parentElement, this._onchange))[0];
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

  _setScenesPosition() {
    const map = { [this.scenes[0].name]: true };
    for (const scene of this.scenes) {
      const next = (scene.next ? this.sceneMap[scene.next] : null);
      if (next && !map[next.name]) {
        next.setPosition(scene.globalScrollPosition(scene.scrollHeight));
        map[next.name] = true;
      }
    }
  }
}

export class Main {
  constructor(props) {
    this.element = props.element;
    this.scene = new SceneProxy({ parentElement: this.element });
    this.viewRadius = 300;
    this.fontSize = 1;
    this.dtop = 0;
    this._onanimate = this._onanimate.bind(this);
  }

  load(data) {
    return this.scene.load(data).then(() => this._moveByScene());
  }

  resize() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    this.fontSize = this._calcFontSize(cx, cy, this.viewRadius);
    this.element.style.padding = cy + 'px ' + cx + 'px';
    this.element.style.fontSize = this._round(this.fontSize) + 'px';
  }

  scroll(_, dy) {
    if (!dy) {
      return;
    }
    const needsRequest = !this.dtop;
    this.dtop = dy / this.fontSize;
    if (needsRequest) {
      requestAnimationFrame(this._onanimate);
    }
  }

  _calcFontSize(cx, cy, viewRadius) {
    return Math.sqrt(cx * cx + cy * cy) / viewRadius;
  }

  _move(left, top) {
    const t = 'translate3d(' + -this._round(left) + 'em, ' + -this._round(top) + 'em, 0)';
    this.element.style.transform = t;
  }

  _moveByScene() {
    const p = this.scene.scrollPosition();
    this._move(p.left, p.top);
  }

  _onanimate() {
    this.scene.scrollBy(this.dtop);
    this._moveByScene();
    this.dtop = 0;
  }

  _round(n) {
    return Math.round(n * 100) / 100;
  }
}
