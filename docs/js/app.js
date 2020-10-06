import { ScrollHandler } from './scroll-handler.js'

export class App {
  constructor () {
    this.scrollHandler = new ScrollHandler({ onscroll: this.scroll.bind(this) })
    this.x = 0
    this.y = 0
  }

  init () {
    this.scrollHandler.enable()
  }

  scroll (dx, dy) {
    this.x += dx
    this.y += dy
    document.body.style.backgroundPosition = -this.x + 'px ' + -this.y + 'px'
  }
}
