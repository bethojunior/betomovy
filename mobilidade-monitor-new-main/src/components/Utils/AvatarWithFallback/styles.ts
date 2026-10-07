import styled from 'styled-components'
import { theme_colors } from '../../../theme/theme'

export const Wrapper = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${theme_colors.light_gray};
  color: ${theme_colors.gray};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
