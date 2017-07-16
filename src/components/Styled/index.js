import styled from 'styled-components'
import {colors} from '../../variables'

export const StyledButton = styled.button`
  background-color: ${props => props.primary ? colors.orange : colors.white};
  border-radius: 5px;
  border: 1px solid ${props => props.primary ? colors.orange : colors.white};
  color: ${props => props.primary ? colors.white : colors.text};
  cursor: pointer;
  font-size: 14px;
  padding: 11px 22px;
  margin: 5px;
  position: relative;
  vertical-align: bottom;
  white-space: normal;
  &:hover {
    color: ${props => props.primary ? colors.white : colors.text};
    background-color: ${props => props.primary ? colors.purple : colors.gray};
    border-color: ${props => props.primary ? colors.red : colors.white}
  }
  &:focus {
    color: ${props => props.primary ? colors.white : colors.white};
    background-color: ${props => props.primary ? colors.purple : colors.gray};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const StyledInput = styled.input`
  appearance: none;
  border-width: 1px;
  border-color: ${colors.white};
  border-radius: 5px;
  border-style: solid;
  box-shadow: none;
  max-width: 190px;
  box-sizing: border-box;
  color: ${colors.text};
  font-size: 20px;
  margin-bottom: 5px;
  padding: 8px 20px;
  &:hover {
    border-color: ${colors.orange};
  }
  &:focus {
    border-color: ${colors.orange};
    box-shadow: inset 0 1px 3px ${colors.gray};
    outline: none;
  }
`
