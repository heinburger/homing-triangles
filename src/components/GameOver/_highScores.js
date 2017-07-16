import React, {Component} from 'react'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import gameStore from '../../stores/game'

const Blink = keyframes`
  0% { opacity: 1.0; }
  50% { opacity: 0.0; }
  100% { opacity: 1.0; }
`

const HighScoreTitle = styled.h2`
  animation: 0.5s ${Blink} linear infinite;
`

const HighScoresDiv = styled.div`
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  text-align: left;
  padding-bottom: 5px;
`
const HighScoreCol = styled.div`
  flex: 0 0 ${props => props.basis};
`

@observer class HighScores extends Component {
  render() {
    const {highScores, loadingScores} = gameStore
    return (
      <div style={{paddingBottom: '50px'}}>
        <HighScoreTitle>
          {loadingScores ? 'loading...' : 'high scores'}
        </HighScoreTitle>
        <HighScoresDiv>
          <HighScoreCol basis={'60%'}><b>name</b></HighScoreCol>
          <HighScoreCol basis={'40%'}><b>kills</b></HighScoreCol>
        </HighScoresDiv>
        {highScores.map((score, i) => {
          return (
            <HighScoresDiv key={i}>
              <HighScoreCol basis={'60%'}>{score.name}</HighScoreCol>
              <HighScoreCol basis={'40%'}>{score.kills}</HighScoreCol>
            </HighScoresDiv>
          )
        })}
      </div>
    )
  }
}

export default HighScores
