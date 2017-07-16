import {overlapping} from './_utils'
import {colors} from '../variables'

export default class Bomb {
  constructor (x, y, toX, toY) {
    this.alive = true
    this.exploding = false
    this.explodeLength = 500 // ms
    this.hitbox = 30
    this.hitboxSwellIncrement = 3
    this.hitboxMax = 100
    this.windowExtension = 0
    this.altCount = 0
    this.altMod = 15
    this.velocity = 30
    this.distance = Math.sqrt(Math.abs(toY - y) * Math.abs(toY - y) + Math.abs(toX - x) * Math.abs(toX - x))
    this.x = x - this.hitbox / 2
    this.y = y - this.hitbox / 2
    this.toX = toX - this.hitbox / 2
    this.toY = toY - this.hitbox / 2
    this.dx = (toX - x) / this.distance * this.velocity
    this.dy = (toY - y) / this.distance * this.velocity
    this.acceleration = 1
  }

  draw = (context) => {
    if (this.exploding) {
      this.altCount++
      context.fillStyle = this.altCount % this.altMod < this.altMod * 0.8
        ? colors.yellow
        : colors.red
    } else {
      context.fillStyle = colors.black
    }
    context.fillRect(this.x, this.y, this.hitbox, this.hitbox)
    context.strokeStyle = colors.yellow
    context.strokeRect(this.x, this.y, this.hitbox, this.hitbox)
  }

  update = (context, triangles) => {
    this._checkEnemyInteractions(triangles)
    if (this.exploding) {
      this._continueExploding()
    }
    this._incrementPosition()
    this.draw(context)
  }

  getPosition = () => {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.hitbox,
      bottom: this.y + this.hitbox
    }
  }

  _incrementPosition = () => {
    this.x += this.dx
    this.y += this.dy
  }

  _incrementPosition = () => {
    this.x += this.dx
    this.y += this.dy
  }

  _explode = () => {
    this.dx = 0
    this.dy = 0
    setTimeout(() => this.alive = false, this.explodeLength)
    this.exploding = true
  }

  _continueExploding = () => {
    if (this.hitbox <= this.hitboxMax) {
      this.hitbox += this.hitboxSwellIncrement
      this.x -= this.hitboxSwellIncrement / 2
      this.y -= this.hitboxSwellIncrement / 2
    }
  }

  _checkEnemyInteractions = (enemies) => {
    enemies.slice().forEach((e, i) => {
      if (e.alive) {
        if (overlapping(this.getPosition(), e.getPosition())) {
          if (!this.exploding) {
            this._explode()
          }
          e.kill()
        }
      }
    })
  }
}
