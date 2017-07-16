import {overlapping} from './_utils'
import {colors} from '../variables'

export default class Player {
  constructor (kill) {
    this.kill = kill
    this.side = 30
    this.invincible = true
    this.sick = false
    this.color = colors.purple
    this.altCount = 0
    this.altMod = 15
    this.x = window.innerWidth / 2 - this.side / 2
    this.y = window.innerHeight / 2 - this.side / 2
    document.addEventListener('mousemove', this._handleMouseMove)
    document.addEventListener('touchmove', this._handleTouchMove)
  }

  draw = (context) => {
    if (this.invincible) {
      this.altCount++
      context.fillStyle = this.altCount % this.altMod < this.altMod * 0.5
        ? colors.purple
        : colors.lightPurple
    } else {
      context.fillStyle = colors.purple
    }
    context.fillRect(this.x, this.y, this.side, this.side)
  }

  update = (context, squares, powerUps) => {
    this.sick = false
    if (!this.invincible) {
      this._checkPowerUpInteractions(powerUps)
    }
    this.draw(context)
    this._checkGameOver()
  }

  getPosition = () => {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.side,
      bottom: this.y + this.side
    }
  }

  _checkPowerUpInteractions = (powerUps) => {
    powerUps.slice().forEach((p, i) => {
      if (overlapping(this.getPosition(), p.getPosition())) {
        if (p.alive) {
          if (p.poison) {
            this.sick = true
          } else {
            this.growing -= 1
          }
          p.kill()
        }
      }
    })
  }

  _checkGameOver = () => {
    if (this.side > window.innerWidth) {
      this.kill()
    }
  }

  _handleMouseMove = (e) => {
    const x = e.clientX - this.side / 2
    const y = e.clientY - this.side / 2
    this.x = x > window.innerWidth - this.side || x < 0
      ? this.x
      : x
    this.y = y > window.innerHeight - this.side || y < 0
      ? this.y
      : y
  }

  _handleTouchMove = (e) => {
    const touch = e.touches[0]
    const x = touch.pageX - this.side / 2
    const y = (touch.pageY - this.side / 2) - 50
    this.x = x > window.innerWidth - this.side || x < 0
      ? this.x
      : x
    this.y = y > window.innerHeight - this.side || y < 0
      ? this.y
      : y
  }
}
