import {overlapping} from './_utils'
import {colors} from '../variables'

export default class Player {
  constructor (kill, throwBomb) {
    this.kill = kill
    this.kills = 0
    this.bombsUsed = 0
    this.throwBomb = throwBomb
    this.maxHealth = 10
    this.health = 10
    this.hitbox = 30 // use int for now, but can use a shape later
    this.windowExtension = 0
    this.invincible = true
    this.bombs = 1
    this.altCount = 0
    this.altMod = 15
    this.x = window.innerWidth / 2 - this.hitbox / 2
    this.y = window.innerHeight / 2 - this.hitbox / 2
    this.dx = 0
    this.dy = 0
    this.velocity = 9
    this.acceleration = 1
    this.accelerationMap = {
      up: false,
      right: false,
      down: false,
      left: false
    }
    this.decelerationIntervalTime = 25 // ms
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

    document.addEventListener('click', this._handleClick)
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
    context.strokeText(this.bombs, this.x + this.hitbox / 3.2, this.y + this.hitbox / 1.3, this.hitbox)

    context.strokeStyle = colors.secondary
    context.beginPath()
    context.moveTo(this.crosshair.x + this.crosshair.size / 2, this.crosshair.y)
    context.lineTo(this.crosshair.x - this.crosshair.size / 2, this.crosshair.y)
    context.moveTo(this.crosshair.x, this.crosshair.y + this.crosshair.size / 2)
    context.lineTo(this.crosshair.x, this.crosshair.y - this.crosshair.size / 2)
    context.closePath()
    context.stroke()

    context.fillStyle = colors.red
    context.fillRect(this.x, this.y + this.hitbox + 3, this.health / this.maxHealth * this.hitbox, 10)
    context.strokeStyle = colors.playerOutline
    context.strokeRect(this.x, this.y + this.hitbox + 3, this.hitbox, 10)

  }

  update = (context, triangles, powerUps) => {
    if (!this.invincible) {
      this._checkEnemyInteractions(triangles)
    }
    this._checkPowerUpInteractions(powerUps)
    this._incrementVelocity()
    this._incrementPosition()
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

  _incrementVelocity = () => {
    if (this.accelerationMap.up && this.dy >= -this.velocity && !(this.dy - this.acceleration < -this.velocity)) {
      this.dy -= this.acceleration
    }
    if (this.accelerationMap.right && this.dx <= this.velocity && !(this.dx + this.acceleration > this.velocity)) {
      this.dx += this.acceleration
    }
    if (this.accelerationMap.down && this.dy <= this.velocity && !(this.dy + this.acceleration > this.velocity)) {
      this.dy += this.acceleration
    }
    if (this.accelerationMap.left && this.dx >= -this.velocity && !(this.dx - this.acceleration < -this.velocity)) {
      this.dx -= this.acceleration
    }
  }

  _incrementPosition = () => {
    this.x += this.dx
    this.y += this.dy
  }

  _checkPowerUpInteractions = (powerUps) => {
    powerUps.slice().forEach((p, i) => {
      if (p.alive) {
        if (overlapping(this.getPosition(), p.getPosition())) {
          this.bombs++
          p.kill()
        }
      }
    })
  }

  _checkEnemyInteractions = (enemies) => {
    enemies.slice().forEach((e, i) => {
      if (e.alive) {
        if (overlapping(this.getPosition(), e.getPosition())) {
          this.health--
          this.kills++
          e.kill()
        }
      }
    })
  }

  _checkGameOver = () => {
    if (this.health < 0) {
      this.kill()
      document.removeEventListener('click', this._handleClick)
      document.removeEventListener('keydown', this._handleKeyDown)
      document.removeEventListener('keyup', this._handleKeyUp)
      document.removeEventListener('mousemove', this._handleMouseMove)
    }
  }

  _handleClick = (e) => {
    if (this.bombs) {
      this.throwBomb(this.x + this.hitbox / 2, this.y + this.hitbox / 2, this.crosshair.x, this.crosshair.y, () => this.kills++)
      this.bombs--
      this.bombsUsed++
    }
  }

  _handleMouseMove = (e) => {
    this.crosshair.x = e.clientX
    this.crosshair.y = e.clientY
  }

  _handleKeyDown = (e) => {
    switch (e.keyCode) {
      case this.controlMap.up:
        this.accelerationMap.up = true
        break
      case this.controlMap.right:
        this.accelerationMap.right = true
        break
      case this.controlMap.down:
        this.accelerationMap.down = true
        break
      case this.controlMap.left:
        this.accelerationMap.left = true
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
        this.accelerationMap.up = false
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
        this.accelerationMap.right = false
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
        this.accelerationMap.down = false
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
        this.accelerationMap.left = false
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

  _boundryInteraction = () => {
    if (this.x + this.hitbox > window.innerWidth + this.windowExtension) {
      clearInterval(this.decelerationIntervalIds.left)
      this.x = window.innerWidth + this.windowExtension - this.hitbox
      this.dx = 0
    }

    if (this.x + this.windowExtension < 0) {
      clearInterval(this.decelerationIntervalIds.right)
      this.x = 0 - this.windowExtension
      this.dx = 0
    }

    if (this.y + this.hitbox > window.innerHeight + this.windowExtension) {
      clearInterval(this.decelerationIntervalIds.up)
      this.y = window.innerHeight + this.windowExtension - this.hitbox
      this.dy = 0
    }

    if (this.y + this.windowExtension < 0) {
      clearInterval(this.decelerationIntervalIds.down)
      this.y = 0 - this.windowExtension
      this.dy = 0
    }
  }
}
