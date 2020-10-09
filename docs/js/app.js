import { ScrollHandler } from './scroll-handler.js'

export class App {
  constructor () {
    this.scrollHandler = new ScrollHandler({ onscroll: this.scroll.bind(this) })
    this.x = 0
    this.y = 0
  }

  init () {
    const style = document.body.style
    style.backgroundAttachment = 'fixed'
    style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmYWZhZmEiIC8+PHBhdGggZD0iTSAxMjAgMCBMIDAgMCAwIDEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzU3NTc1IiBzdHJva2Utd2lkdGg9IjEiIC8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')"
    style.backgroundSize = '120px 120px'
    this.scrollHandler.enable()
  }

  scroll (dx, dy) {
    this.x += dx
    this.y += dy
    document.body.style.backgroundPosition = -this.x + 'px ' + -this.y + 'px'
  }
}
