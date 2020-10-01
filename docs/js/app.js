class Draggable {
  constructor (props) {
    this.element = props.element
    this.onstart = props.onstart
    this.onmove = props.onmove
    this.onend = props.onend
    this.onmousedown = this.onmousedown.bind(this)
    this.onmousemove = this.onmousemove.bind(this)
    this.onmouseup = this.onmouseup.bind(this)
    this.ontouchstart = this.ontouchstart.bind(this)
    this.ontouchmove = this.ontouchmove.bind(this)
    this.ontouchend = this.ontouchend.bind(this)
    this.identifier = null
    this.startPageX = 0
    this.startPageY = 0
  }

  static getOffset (element) {
    const rect = element.getBoundingClientRect()
    const bodyRect = document.body.getBoundingClientRect()
    const bodyStyle = window.getComputedStyle(document.body)
    const x = rect.left - element.scrollLeft - bodyRect.left + parseInt(bodyStyle.marginLeft, 10)
    const y = rect.top - element.scrollTop - bodyRect.top + parseInt(bodyStyle.marginTop, 10)
    return { x, y }
  }

  enable () {
    const supportsTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const type = (supportsTouch ? 'touchstart' : 'mousedown')
    this.element.addEventListener(type, this['on' + type], { passive: false })
  }

  disable () {
    const supportsTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const startType = (supportsTouch ? 'touchstart' : 'mousedown')
    const moveType = (supportsTouch ? 'touchmove' : 'mousemove')
    const endType = (supportsTouch ? 'touchend' : 'mouseup')
    this.element.removeEventListener(startType, this['on' + startType], { passive: false })
    document.removeEventListener(moveType, this['on' + moveType])
    document.removeEventListener(endType, this['on' + endType])
  }

  onmousedown (event) {
    const offset = Draggable.getOffset(event.target)
    const x = event.pageX - offset.x
    const y = event.pageY - offset.y
    this.startPageX = event.pageX
    this.startPageY = event.pageY
    this.onstart.call(null, { x, y, event })
    document.addEventListener('mousemove', this.onmousemove)
    document.addEventListener('mouseup', this.onmouseup)
  }

  onmousemove (event) {
    const dx = event.pageX - this.startPageX
    const dy = event.pageY - this.startPageY
    this.onmove.call(null, { dx, dy, event })
  }

  onmouseup (event) {
    document.removeEventListener('mousemove', this.onmousemove)
    document.removeEventListener('mouseup', this.onmouseup)
    this.onend.call(null, { event })
  }

  ontouchstart (event) {
    if (event.touches.length > 1) {
      return
    }
    const touch = event.changedTouches[0]
    const offset = Draggable.getOffset(event.target)
    const x = touch.pageX - offset.x
    const y = touch.pageY - offset.y
    this.identifier = touch.identifier
    this.startPageX = touch.pageX
    this.startPageY = touch.pageY
    this.onstart.call(null, { x, y, event })
    document.addEventListener('touchmove', this.ontouchmove)
    document.addEventListener('touchend', this.ontouchend)
  }

  ontouchmove (event) {
    const touch = event.changedTouches[0]
    if (touch.identifier !== this.identifier) {
      return
    }
    const dx = touch.pageX - this.startPageX
    const dy = touch.pageY - this.startPageY
    this.onmove.call(null, { dx, dy, event })
  }

  ontouchend (event) {
    const touch = event.changedTouches[0]
    if (touch.identifier !== this.identifier) {
      return
    }
    document.removeEventListener('touchmove', this.ontouchmove)
    document.removeEventListener('touchend', this.ontouchend)
    this.onend.call(null, { event })
  }
}

class DragHandler {
  constructor (props) {
    this.onstart = props.onstart
    this.onmove = props.onmove
    this.onend = props.onend
    this.onmomentum = props.onmomentum
    this.draggable = new Draggable({
      element: document,
      onstart: this.start.bind(this),
      onmove: this.move.bind(this),
      onend: this.end.bind(this)
    })
    this.dx = 0
    this.dy = 0
    this.ddx = 0
    this.ddy = 0
    this.requestID = 0
    this.isDiagonal = false
    this.dragend = this.dragend.bind(this)
  }

  enable () {
    this.draggable.enable()
  }

  start (context) {
    context.event.preventDefault()
    this.dx = 0
    this.dy = 0
    if (this.requestID) {
      window.cancelAnimationFrame(this.requestID)
      this.ddx = 0
      this.ddy = 0
    }
    this.onstart()
  }

  move (context) {
    this.ddx = context.dx - this.dx
    this.ddy = context.dy - this.dy
    this.dx = context.dx
    this.dy = context.dy
    this.onmove(this.ddx, this.ddy)
  }

  end () {
    this.onend()
    if (Math.abs(this.ddx) > 1 || Math.abs(this.ddy) > 1) {
      this.isDiagonal = (Math.abs(this.ddx) > 1 && Math.abs(this.ddy) > 1)
      this.requestID = window.requestAnimationFrame(this.dragend)
    }
  }

  dragend () {
    if (this.isDiagonal) {
      if (Math.abs(this.ddx) > Math.abs(this.ddy)) {
        const pddx = this.ddx
        this.ddx += this._calcddd(this.ddx)
        this.ddy *= this.ddx / pddx
      } else {
        const pddy = this.ddy
        this.ddy += this._calcddd(this.ddy)
        this.ddx *= this.ddy / pddy
      }
    } else {
      if (this.ddx) {
        this.ddx += this._calcddd(this.ddx)
      }
      if (this.ddy) {
        this.ddy += this._calcddd(this.ddy)
      }
    }
    const ddx = Math.round(this.ddx)
    const ddy = Math.round(this.ddy)
    if (!ddx && !ddy) {
      this.ddx = 0
      this.ddy = 0
      this.requestID = 0
      return
    }
    this.onmomentum(ddx, ddy)
    this.requestID = window.requestAnimationFrame(this.dragend)
  }

  cancel () {
    if (this.requestID) {
      window.cancelAnimationFrame(this.requestID)
      this.ddx = 0
      this.ddy = 0
      this.requestID = 0
    }
  }

  _calcddd (dd) {
    const ddd = (dd > 0 ? -1 : 1)
    if (Math.abs(dd) > 48) {
      return ddd * 4
    } else if (Math.abs(dd) < 24) {
      return ddd / 4
    }
    return ddd
  }
}

class KeyHandler {
  constructor (props) {
    this.handlers = {
      37: props.onleft,
      38: props.onup,
      39: props.onright,
      40: props.ondown
    }
  }

  enable () {
    document.addEventListener('keydown', this.handle.bind(this))
  }

  handle (event) {
    const handler = this.handlers[event.which]
    if (handler) {
      event.preventDefault()
      handler()
    }
  }
}

class WheelHandler {
  constructor (props) {
    this.onstart = props.onstart
    this.onmove = props.onmove
    this.onend = props.onend
    this.isStarted = false
    this.timeoutID = 0
    this.wheelend = this.wheelend.bind(this)
  }

  enable () {
    document.addEventListener('wheel', this.handle.bind(this))
  }

  handle (event) {
    if (!this.isStarted) {
      this.isStarted = true
      this.wheelstart()
    }
    this.wheelmove(event.deltaX, event.deltaY)
    if (this.timeoutID) {
      clearTimeout(this.timeoutID)
    }
    this.timeoutID = setTimeout(this.wheelend, 100)
  }

  wheelstart () {
    this.onstart()
  }

  wheelmove (dx, dy) {
    this.onmove(dx, dy)
  }

  wheelend () {
    this.onend()
    this.isStarted = false
    this.timeoutID = 0
  }
}

class ScrollHandler {
  constructor (props) {
    this.onscroll = props.onscroll
    this.dragHandler = new DragHandler({
      onstart: () => { /* do nothing */ },
      onmove: (dx, dy) => { this.scroll(-dx, -dy) },
      onend: () => { /* do nothing */ },
      onmomentum: (dx, dy) => { this.scroll(-dx, -dy) }
    })
    this.keyHandler = new KeyHandler({
      onleft: () => { this.scroll(-40, 0) },
      onup: () => { this.scroll(0, -40) },
      onright: () => { this.scroll(40, 0) },
      ondown: () => { this.scroll(0, 40) }
    })
    this.wheelHandler = new WheelHandler({
      onstart: () => { this.dragHandler.cancel() },
      onmove: (dx, dy) => { this.scroll(dx, dy) },
      onend: () => { /* do nothing */ }
    })
  }

  enable () {
    this.dragHandler.enable()
    this.keyHandler.enable()
    this.wheelHandler.enable()
  }

  scroll (dx, dy) {
    this.onscroll(dx, dy)
  }
}

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
