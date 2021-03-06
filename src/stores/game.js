import {useStrict, observable, computed, action, autorun} from 'mobx'

import entityStore from './entity'
import highScoreStore from './highScores'

useStrict(true)
class GameStore {
  @observable name = ''
  @observable showGameOver = false
  @observable showInstructions = true

  constructor () {
    autorun(() => {
      if (entityStore.dead) {
        this.endGame()
      }
    })
  }

  @computed get gameTime () {
    return entityStore.timer.formattedTime
  }

  @computed get numberOfBombsUsed () {
    return entityStore.player.bombsUsed
  }

  @computed get numberOfKills () {
    return entityStore.player.kills
  }

  @computed get submitError () {
    return highScoreStore.errors.has('post')
  }

  @computed get getScoresError () {
    return highScoreStore.errors.has('get')
  }

  @computed get disableSubmit () {
    return highScoreStore.posting || highScoreStore.scoreAccepted
  }

  @computed get scoreSubmitted () {
    return !highScoreStore.posting && highScoreStore.scoreAccepted
  }

  @computed get highScores () {
    return highScoreStore.scores
  }

  @computed get loadingScores () {
    return highScoreStore.requesting
  }

  @action onPageResize = () => {
    entityStore.setCanvasSize()
  }

  @action onInstructionsClick = () => {
    this.showInstructions = true
    this.showGameOver = false
  }

  @action onStartGameClick = () => {
    this.showInstructions = false
    this.showGameOver = false
    highScoreStore.scoreAccepted = false
    entityStore.generate()
    this.startGame()
  }

  @action onNameChange = (e) => {
    this.name = e.target.value
  }

  @action onSubmitClick = () => {
    highScoreStore.postScore({
      name: this.name,
      mode: this.mode,
      time: this.gameTime,
      number: this.numberOfSquares
    })
  }

  @action endGame = () => {
    this.showGameOver = true
    highScoreStore.getScores()
  }

  @action startGame = () => {
    entityStore.start()
  }
}

const gameStore = new GameStore()
export default gameStore
