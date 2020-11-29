import { Scene } from './scene.js';

class TestScene extends Scene {
  loadComponents() {
    const cel = document.createElement('div');
    cel.style.position = 'absolute';
    cel.style.transform = 'translate3d(-50%, -50%, 0)';
    cel.style.width = '120em';
    cel.style.height = '120em';

    const el = new Image();
    el.style.width = '100%';

    cel.appendChild(el);
    this.element.appendChild(cel);

    return new Promise((resolve, reject) => {
      el.onload = () => resolve();
      el.onerror = error => reject(error);
      el.src = 'svg/001.svg';
    });
  }
}

class TestScene1 extends TestScene {
  scrollPosition(scrollTop) {
    return {
      left: scrollTop / 2,
      top: scrollTop,
    };
  }
}

class TestScene2 extends TestScene {
  scrollPosition(scrollTop) {
    return {
      left: -scrollTop,
      top: 0,
    };
  }
}

class TestScene3 extends TestScene {
  scrollPosition(scrollTop) {
    return {
      left: scrollTop / 2,
      top: -scrollTop,
    };
  }
}

export const ContentData = {
  scenes: [
    new TestScene1({ name: '1', scrollHeight: 480, next: '2', prev: '3' }),
    new TestScene2({ name: '2', scrollHeight: 480, next: '3', prev: '1' }),
    new TestScene3({ name: '3',  scrollHeight: 480, next: '1', prev: '2' }),
  ]
};
