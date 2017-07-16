import {useStrict, action, observable} from 'mobx'

import Player from '../entities/Player'
import Triangle from '../entities/Triangle'
import PowerUp from '../entities/PowerUp'
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
    this.initialNumberOfTriangles = 0
    this.startingTriangleSize = 15
    this.startingVelocityXMultiplier = 5
    this.startingVelocityYMultiplier = 2
    this.addPowerUpChance = 0.005
    this.addTriangleChance = 0.01
  }

  @action generate = () => {
    this.setCanvasSize()
    this.playerActive = false
    this.dead = false
    this.time = 0
    window.cancelAnimationFrame(this.requestId)
    this._generateEntities()
    this.update()
  }

  @action endGame = () => {
    this.dead = true
    window.cancelAnimationFrame(this.requestId)
  }

  setCanvasSize = () => {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  update = () => {
    this.requestId = window.requestAnimationFrame(this.update)
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    // for (let p of this.powerUps) {
    //   if (p.alive) { p.update(this.context) }
    // }
    // for (let t of this.triangles) {
    //   if (t.alive) { t.update(this.context, this.player.sick) }
    // }
    if (this.playerActive) {
      this.player.update(this.context, this.squares, this.powerUps)
    }
    this.timer.update(this.context)

    this._addRandomPowerUp()
    // this._addTriangleWave()
  }

  start = () => {
    this.timer.start()
    this.playerActive = true
    setTimeout(() => this.player.invincible = false, 2000)
  }

  _generateEntities = () => {
    this.timer = new Timer()
    this.player = new Player(this.endGame)
    this.powerUps = []
    this.triangles = []
  }

  _addTriangleWave = () => {

  }

  _generateTriangleWave = () => {
    if (!this.triangles) { this.triangles = [] }
    const times = [...Array(this.initialNumberOfTriangles).keys()]
    times.forEach(() => this.triangles.push(this._genereateOneTriangle()))
  }

  _genereateOneTriange = () => {
    const side = this.startingTriangleSize
    const x = Math.random() * (window.innerWidth - side)
    const y = Math.random() * (window.innerHeight - side)
    const dx = (Math.random() - 0.5) * this.startingVelocityXMultiplier
    const dy = (Math.random() - 0.5) * this.startingVelocityYMultiplier
    return new Triangle(x, y, dx, dy, side)
  }

  _addRandomPowerUp = () => {
    if (Math.random() < this.addPowerUpChance) {
      this.powerUps.push(new PowerUp())
    }
  }
}

const entityStore = new EntityStore()
export default entityStore
