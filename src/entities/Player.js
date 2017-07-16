import {overlapping} from './_utils'
import {colors} from '../variables'

export default class Player {
  constructor (kill) {
    this.kill = kill
    this.hitbox = 30 // use int for now, but can use a shape later
    this.windowExtension = 0
    this.invincible = true
    this.sick = false
    this.altCount = 0
    this.altMod = 15
    this.x = window.innerWidth / 2 - this.hitbox / 2
    this.y = window.innerHeight / 2 - this.hitbox / 2
    this.dx = 0
    this.dy = 0
    this.velocity = 9
    this.acceleration = 1
    this.accelerationIntervaleTime = 50 // ms
    this.accelerationIntervalIds = {
      up: undefined,
      right: undefined,
      down: undefined,
      left: undefined
    }
    this.decelerationIntervalTime = 50 // ms
    this.decelerationIntervalIds = {
      up: undefined,
      right: undefined,
      down: undefined,
      left: undefined
    }
    this.controlMap = {
      up: 87,
      right: 68,
      down: 83,
      left: 65,
      use: 69
    }

    this.crosshair = {
      size: 20,
      x: 0,
      y: -300 // start off screen
    }

    document.addEventListener('keydown', this._handleKeyDown)
    document.addEventListener('keyup', this._handleKeyUp)
    document.addEventListener('mousemove', this._handleMouseMove)
  }

  draw = (context) => {
    if (this.invincible) {
      this.altCount++
      context.fillStyle = this.altCount % this.altMod < this.altMod * 0.5
        ? colors.playerColor
        : colors.playerInvincibleAlternate
    } else {
      context.fillStyle = colors.playerColor
    }
    context.fillRect(this.x, this.y, this.hitbox, this.hitbox)
    context.strokeStyle = colors.playerOutline
    context.strokeRect(this.x, this.y, this.hitbox, this.hitbox)

    context.strokeStyle = colors.secondary
    context.beginPath()
    context.moveTo(this.crosshair.x + this.crosshair.size / 2, this.crosshair.y)
    context.lineTo(this.crosshair.x - this.crosshair.size / 2, this.crosshair.y)
    context.moveTo(this.crosshair.x, this.crosshair.y + this.crosshair.size / 2)
    context.lineTo(this.crosshair.x, this.crosshair.y - this.crosshair.size / 2)
    context.stroke()

  }

  update = (context, squares, powerUps) => {
    this.sick = false
    if (!this.invincible) {
      this._checkPowerUpInteractions(powerUps)
    }
    this.x += this.dx
    this.y += this.dy
    this._boundryInteraction()
    this.draw(context)
    this._checkGameOver()
  }

  getPosition = () => {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.hitbox,
      bottom: this.y + this.hitbox
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
    if (this.hitbox > window.innerWidth) {
      this.kill()
    }
  }

  _handleMouseMove = (e) => {
    this.crosshair.x = e.clientX
    this.crosshair.y = e.clientY
  }

  _handleKeyDown = (e) => {
    switch (e.keyCode) {
      case this.controlMap.up:
        if (this.dy >= -this.velocity) {
          this._speedUpInterval('up', () => {
            if (this.dy - this.acceleration < -this.velocity) {
              clearInterval(this.accelerationIntervalIds.up)
            } else {
              this.dy -= this.acceleration
            }
          })
        }
        break
      case this.controlMap.right:
        if (this.dx <= this.velocity) {
          this._speedUpInterval('right', () => {
            if (this.dx + this.acceleration > this.velocity) {
              clearInterval(this.accelerationIntervalIds.right)
            } else {
              this.dx += this.acceleration
            }
          })
        }
        break
      case this.controlMap.down:
        if (this.dy <= this.velocity) {
          this._speedUpInterval('down', () => {
            if (this.dy + this.acceleration > this.velocity) {
              clearInterval(this.accelerationIntervalIds.down)
            } else {
              this.dy += this.acceleration
            }
          })
        }
        break
      case this.controlMap.left:
        if (this.dx >= -this.velocity) {
          this._speedUpInterval('left', () => {
            if (this.dx - this.acceleration < -this.velocity) {
              clearInterval(this.accelerationIntervalIds.left)
            } else {
              this.dx -= this.acceleration
            }
          })
        }
        break
      case this.controlMap.use:
        // not sure yet
        break
      default:
        break
    }
  }

  _handleKeyUp = (e) => {
    switch (e.keyCode) {
      case this.controlMap.up:
        if (this.dy < 0) {
          this._slowDownInterval('up', () => {
            if (this.dy + this.acceleration > 0) {
              clearInterval(this.decelerationIntervalIds.up)
            } else {
              this.dy += this.acceleration
            }
          })
        }
        break
      case this.controlMap.right:
        if (this.dx > 0) {
          this._slowDownInterval('right', () => {
            if (this.dx - this.acceleration < 0) {
              clearInterval(this.decelerationIntervalIds.right)
            } else {
              this.dx -= this.acceleration
            }
          })
        }
        break
      case this.controlMap.down:
        if (this.dy > 0) {
          this._slowDownInterval('down', () => {
            if (this.dy - this.acceleration < 0) {
              clearInterval(this.decelerationIntervalIds.down)
            } else {
              this.dy -= this.acceleration
            }
          })
        }
        break
      case this.controlMap.left:
        if (this.dx < 0) {
          this._slowDownInterval('left', () => {
            if (this.dx + this.acceleration > 0) {
              clearInterval(this.decelerationIntervalIds.left)
            } else {
              this.dx += this.acceleration
            }
          })
        }
        break
      case this.controlMap.use:
        // not sure yet
        break
      default:
        break
    }
  }

  _slowDownInterval = (direction, fn) => {
    clearInterval(this.decelerationIntervalIds[direction])
    this.decelerationIntervalIds[direction] = setInterval(
      fn,
      this.decelerationIntervalTime
    )
  }

  _speedUpInterval = (direction, fn) => {
    clearInterval(this.accelerationIntervalIds[direction])
    this.accelerationIntervalIds[direction] = setInterval(
      fn,
      this.accelerationIntervalTime
    )
  }

  _boundryInteraction = () => {
    if (this.x + this.hitbox > window.innerWidth + this.windowExtension) {
      clearInterval(this.decelerationIntervalIds.left)
      clearInterval(this.accelerationIntervalIds.right)
      this.x = window.innerWidth + this.windowExtension - this.hitbox
      this.dx = 0
    }

    if (this.x + this.windowExtension < 0) {
      clearInterval(this.decelerationIntervalIds.right)
      clearInterval(this.accelerationIntervalIds.left)
      this.x = 0 - this.windowExtension
      this.dx = 0
    }

    if (this.y + this.hitbox > window.innerHeight + this.windowExtension) {
      clearInterval(this.decelerationIntervalIds.up)
      clearInterval(this.accelerationIntervalIds.down)
      this.y = window.innerHeight + this.windowExtension - this.hitbox
      this.dy = 0
    }

    if (this.y + this.windowExtension < 0) {
      clearInterval(this.decelerationIntervalIds.down)
      clearInterval(this.accelerationIntervalIds.up)
      this.y = 0 - this.windowExtension
      this.dy = 0
    }
  }
}
