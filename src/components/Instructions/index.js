import React, {Component} from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import gameStore from '../../stores/game'
import {colors} from '../../variables'

import {StyledButton} from '../Styled'

const InstructionsDiv = styled.div`
  font-size: larger;
  text-align: center;
  padding: 10px 30px 40px;
  color: ${colors.text};
  background: none;
`

const StyledTitle = styled.h2`
  color: ${colors.green};
  text-shadow: 1px 3px 0 ${colors.text};
  line-height: 75px;
  margin-bottom: 20px;
  font-size: 80px;
`

@observer class Instructions extends Component {
  render() {
    const {onStartGameClick} = gameStore
    return (
      <InstructionsDiv>
        <StyledTitle>homing triangles</StyledTitle>
        <p>shoot the homing triangles. W, A, S, D to move. click to fire bombs</p>
        <StyledButton primary onClick={onStartGameClick}>start</StyledButton>
      </InstructionsDiv>
    )
  }
}

export default Instructions
