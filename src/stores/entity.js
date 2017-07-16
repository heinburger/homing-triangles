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
    this.powerUpMod= 300
    this.initialNumberOfTriangles = 10
    this.startingTriangleSize = 15
    this.startingVelocityXMultiplier = 5
    this.startingVelocityYMultiplier = 2
    this.addTriangleChance = 0.1
    this.triangleWaveNumber = 1
  }

  @action generate = () => {
    this.setCanvasSize()
    this.playerActive = false
    this.dead = false
    this.time = 0
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
    for (let p of this.powerUps) {
      if (p.alive) { p.update(this.context) }
    }
    for (let t of this.triangles) {
      if (t.alive) { t.update(this.context, this.player) }
    }
    if (this.playerActive) {
      this.player.update(this.context, this.triangles, this.powerUps)
    }
    for (let b of this.bombs) {
      if (b.alive) { b.update(this.context, this.triangles) }
    }
    this.timer.update(this.context)

    this._addPowerUp()
    if (this.triangles.filter((t) => t.alive).length === 0) {
      this._addTriangleWave()
    }
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
    const size = this.startingTriangleSize
    const x = Math.random() * (window.innerWidth - size)
    const y = Math.random() * (window.innerHeight - size)
    const dx = 0
    const dy = 0
    return new Triangle(x, y, dx, dy, size,)
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
