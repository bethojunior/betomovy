import styled, { css, keyframes } from 'styled-components'
import { theme_colors } from '../../../../theme/theme'

const fadeInScale = keyframes`
  from { opacity: 0.6; transform: scale(0.98); }
  to   { opacity: 1;   transform: scale(1); }
`

export const MarkerIcon = styled.div`
  background-size: cover;
  width: 35px;
  height: 35px;
  margin-right: 5px;
`

export const MapWrapper = styled.div<{ $expanded: boolean }>`
  position: ${({ $expanded }) => ($expanded ? 'fixed' : 'relative')};
  top: ${({ $expanded }) => ($expanded ? '0' : 'auto')};
  left: ${({ $expanded }) => ($expanded ? '0' : 'auto')};
  width: ${({ $expanded }) => ($expanded ? '100vw' : '100%')};
  height: ${({ $expanded }) => ($expanded ? '100vh' : '40vh')};
  z-index: ${({ $expanded }) => ($expanded ? '9999' : 'auto')};
  border-radius: ${({ $expanded }) => ($expanded ? '0' : '10px')};
  overflow: hidden;

  ${({ $expanded }) =>
    $expanded &&
    css`
      animation: ${fadeInScale} 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    `}
`

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`

export const ExpandButton = styled.button<{ $expanded: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
  color: ${theme_colors.midnight_blue};
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.96);
  }
`
