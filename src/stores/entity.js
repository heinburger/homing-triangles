import {useStrict, action, observable} from 'mobx'

import Player from '../entities/Player'
import Triangle from '../entities/Triangle'
import PowerUp from '../entities/PowerUp'
import Bomb from '../entities/Bomb'
import Timer from '../entities/Timer'

useStrict(true)
class EntityStore {
  @observable dead = false

  constructor () {
    this.canvas = document.getElementById('entities')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.context = this.canvas.getContext('2d')
    this.playerActive = false
    this.powerUpCounter = 0
    this.powerUpMod= 200
    this.startingTriangleSize = 15
    this.startingVelocityXMultiplier = 5
    this.startingVelocityYMultiplier = 2
    this.addTriangleChance = 0.1
    this.triangleWaveNumber = 1
    this.initialNumberOfTriangles = 30
    this.maxBombs = 9
  }

  @action generate = () => {
    this.setCanvasSize()
    this.playerActive = false
    this.dead = false
    this.triangleWaveNumber = 1
    window.cancelAnimationFrame(this.requestId)
    this._generateEntities()
    this._update()
  }

  @action endGame = () => {
    this.dead = true
    window.cancelAnimationFrame(this.requestId)
  }

  start = () => {
    this.timer.start()
    this.playerActive = true
    setTimeout(() => this.player.invincible = false, 2000)
  }

  setCanvasSize = () => {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  throwBomb = (x, y, toX, toY, onKill) => {
    this.bombs.push(new Bomb(x, y, toX, toY, onKill))
  }

  _generateEntities = () => {
    this.timer = new Timer()
    this.player = new Player(this.endGame, this.throwBomb)
    this.powerUps = []
    this.bombs = []
    this.triangles = []
  }

  _update = () => {
    this.requestId = window.requestAnimationFrame(this._update)
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this._cleanUpDeadEntities()
    for (let p of this.powerUps) {
      p.update(this.context)
    }
    for (let t of this.triangles) {
      t.update(this.context, this.triangles, this.player)
    }
    if (this.playerActive) {
      this.player.update(this.context, this.triangles, this.powerUps)
    }
    for (let b of this.bombs) {
      b.update(this.context, this.triangles)
    }
    this.timer.update(this.context)
    if (this.powerUps.length + this.player.bombs < this.maxBombs) {
      this._addPowerUp()
    }
    if (this.triangles.length === 0) {
      this._addTriangleWave()
    }
  }

  _cleanUpDeadEntities = () => {
    this.triangles = this.triangles.filter((t) => t.alive)
    this.powerUps = this.powerUps.filter((p) => p.alive)
    this.bombs = this.bombs.filter((b) => b.alive)
  }

  _addTriangleWave = () => {
    this._generateTriangleWave()
    this.triangleWaveNumber++
  }

  _generateTriangleWave = () => {
    const times = [...Array(this.initialNumberOfTriangles * this.triangleWaveNumber).keys()]
    times.forEach(() => this.triangles.push(this._genereateOneTriangle()))
  }

  _genereateOneTriangle = () => {
    const edge = Math.random() * 4
    const size = this.startingTriangleSize
    const x = edge < 2
      ? Math.random() * (window.innerWidth - size)
      : Math.floor(Math.random() * 2) * window.innerWidth
    const y = edge >= 2
      ? Math.random() * (window.innerHeight - size)
      : Math.floor(Math.random() * 2) * window.innerHeight
    const dx = 0
    const dy = 0
    return new Triangle(x, y, dx, dy, size)
  }

  _addPowerUp = () => {
    this.powerUpCounter++
    if (this.powerUpCounter % this.powerUpMod === 0) {
      this.powerUps.push(new PowerUp())
    }
  }
}

const entityStore = new EntityStore()
export default entityStore
