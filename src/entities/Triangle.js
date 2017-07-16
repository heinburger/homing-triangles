import {colors} from '../variables'
import {rotate} from './_utils'

export default class Triangle {
  constructor (x, y, dx, dy, size) {
    this.windowExtension = 50
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.velocity = 3
    this.maxVelocity = 50
    this.acceleration = 1
    this.orientationAngle = 0
    this.distance = 0
    this.size = size
    this.alive = true
    this.color = colors.lighterBlue
    this.speedUpMultiplier = 1.75
    this.speedUpLength = 5000 // ms
  }

  draw = (context) => {
    const cx = this.x + this.size / 2
    const cy = this.y + this.size / 2
    const [nx, ny] = rotate(cx, cy, this.x, this.y, this.orientationAngle)
    const [nx1, ny1] = rotate(cx, cy, this.x, this.y + this.size, this.orientationAngle)
    const [nx2, ny2] = rotate(cx, cy, this.x + this.size, this.y + this.size / 2, this.orientationAngle)

    context.strokeStyle = colors.playerOutline
    context.fillStyle = colors.blue
    context.beginPath()
    context.moveTo(nx, ny)
    context.lineTo(nx1, ny1)
    context.lineTo(nx2, ny2)
    context.closePath()
    context.stroke()
    context.fill()
  }

  update = (context, player) => {
    this._adjustTo(player)
    this._incrementPosition()
    this._boundryInteraction()
    this.draw(context)
  }

  getPosition = () => {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.size,
      bottom: this.y + this.size
    }
  }

  kill = () => {
    this.alive = false
  }

  _adjustTo = (player) => {
    const x = this.x + this.size / 2
    const y = this.y + this.size / 2
    const toX = player.x + player.hitbox / 2
    const toY = player.y + player.hitbox / 2
    this.orientationAngle = Math.PI * 2 - Math.atan2(toY - y, toX - x)
    this.distance = Math.sqrt(Math.abs(toY - y) * Math.abs(toY - y) + Math.abs(toX - x) * Math.abs(toX - x))
    this.dx = (toX - x) / this.distance * this.velocity
    this.dy = (toY - y) / this.distance * this.velocity
  }

  _boundryInteraction = () => {
    if (this.x + this.size > window.innerWidth + this.windowExtension) {
      this.x = window.innerWidth + this.windowExtension - this.size
      this.dx = -this.dx
    }

    if (this.x + this.windowExtension < 0) {
      this.x = 0 - this.windowExtension
      this.dx = -this.dx
    }

    if (this.y + this.size > window.innerHeight + this.windowExtension) {
      this.y = window.innerHeight + this.windowExtension - this.size
      this.dy = -this.dy
    }

    if (this.y + this.windowExtension < 0) {
      this.y = 0 - this.windowExtension
      this.dy = -this.dy
    }
  }

  _incrementPosition = () => {
    this.x += this.dx
    this.y += this.dy
  }

  // _speedUp = () => {
  //   this.dx = this.dx * this.speedUpMultiplier
  //   this.dy = this.dy * this.speedUpMultiplier
  //   setTimeout(() => this._slowDown(), this.speedUpLength)
  // }
  //
  // _slowDown = () => {
  //   this.dx = this.dx / this.speedUpMultiplier
  //   this.dy = this.dy / this.speedUpMultiplier
  // }
}
