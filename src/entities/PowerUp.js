import {colors} from '../variables'

export default class PowerUp {
  constructor () {
    this.size = 15
    this.getRadius = () => (this.size + this.size * 0.2) / 2
    this.x = window.innerWidth * Math.random() - this.size
    this.y = window.innerHeight * Math.random() - this.size
    this.alive = true
    this.bgColor = colors.purple
    this.color = colors.green
  }

  draw = (context) => {
    context.fillStyle = colors.black
    context.beginPath()
    context.strokeStyle = colors.yellow
    context.arc(this.x + this.size / 2, this.y + this.size / 2, this.getRadius(), 0, Math.PI * 2)
    context.fill()
    context.stroke()
  }

  update = (context) => {
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
}
