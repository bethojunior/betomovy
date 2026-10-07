import { Button, Col } from 'antd'
import { AiOutlineArrowLeft, AiOutlineMenuUnfold } from 'react-icons/ai'
import styled from 'styled-components'
import colors from '../../styles/colors.json'
import { MOBILE_BREAKPOINT } from '../../styles/layout-tokens'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

type MenuMobile = {
  $active: boolean
}

export const MenuMobile = styled.div<MenuMobile>`
  width: 100%;
  background-color: ${colors.main_color_background};
  padding: 4px 6px;
  flex-shrink: 0;
  z-index: 200;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  ${(props) => (!props.$active ? `display: none` : '')}
`
export const LoadingTripContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 20px 0px;
`

export const LoadingMoreTripsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
`

type OptionSelectedMenuMobile = {
  $active: boolean
}

export const OptionMenuMobile = styled(Button)<OptionSelectedMenuMobile>`
  color: #fff !important;
  font-weight: bold;
  margin-top: 0;
  padding: 4px 10px !important;
  height: auto !important;
  font-size: 13px !important;
  white-space: nowrap;
  flex-shrink: 0;

  border-bottom: ${(props) => props.$active && '2px solid #fff !important'};
`

export const HeaderMenuMobile = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ContentColumnTrips = styled.div`
  display: flex;
  width: 100%;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: relative;
  }
`

type ColumnTripsProps = {
  $active: boolean
}

export const ColumnTrips = styled(Col)<ColumnTripsProps>`
  background-color: #fff;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  transition: 300ms;
  display: ${({ $active }) => ($active ? 'flex' : 'none')};
  z-index: 100;
  position: relative;
  box-sizing: border-box;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    flex: none;
    padding-bottom: 72px;
    z-index: 5;
    overflow-x: hidden;
  }

  @media (min-width: 980px) and (max-width: 1024px) {
    max-width: ${({ $active }) => ($active ? '90%' : '0')};
    flex: ${({ $active }) => ($active ? '0 0 35%' : '0')};
  }

  @media (min-width: 1025px) and (max-width: 1366px) {
    max-width: ${({ $active }) => ($active ? '69.2%' : '0')};
    flex: ${({ $active }) => ($active ? '0 0 40%' : '0')};
  }
`

type MapProps = {
  $active: boolean
}

export const ColumnMap = styled(Col)<MapProps>`
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  flex: 1 1 auto;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    flex: none;
    z-index: 1;
    display: ${({ $active }) => ($active ? 'block' : 'none')};
  }

  @media (min-width: ${MOBILE_BREAKPOINT}px) {
    box-shadow: 1px 5px 20px #989595;

    ${(props) => (!props.$active ? `display: none;` : '')}
  }
`

export const IconArrowLeft = styled(AiOutlineArrowLeft)`
  font-size: 30px;
  color: black;
`

export const IconMenuTrips = styled(AiOutlineMenuUnfold)`
  font-size: 50px;
  color: black;
`

export const ContainerTrips = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  margin: 0 0;
  padding: 12px;
  gap: 8px;
`

export const TripCardWrapper = styled.div<{ $removing?: boolean }>`
  flex-shrink: 0;
  overflow: visible;
  max-height: 2000px;
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms ease, transform 300ms ease, max-height 350ms ease;

  ${({ $removing }) => $removing && `
    overflow: hidden;
    opacity: 0;
    transform: scale(0.96);
    max-height: 0;
  `}
`

export const ContainerMenuDesktop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  align-self: center;
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  z-index: 999;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`

/** Agrupa os botões de filtro/fechar da listagem, alinhados no centro verticalmente. */
export const ActiveTripsActions = styled.div`
  display: flex;
  align-items: center;
`

/** Navbar mobile em duas linhas: voltar + abas + sino; segunda linha = cidade (componente com `monitoringMobileNavGrid`). */
export const MobileNavGrid = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 6px;
  row-gap: 6px;
  width: 100%;
  padding: 2px 0 6px;
  box-sizing: border-box;
`

export const MobileNavBackSlot = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
`

export const MobileNavTabsSlot = styled.div`
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const GroupMenuMobile = styled.div`
  flex: 0 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2px;
  flex-wrap: nowrap;
  min-width: 0;
`

export const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ScheduledCounter = styled.span`
  background-color: #faad14;
  color: #000;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`

export const MobileScheduledBar = styled.div`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    background: #fafafa;
    border-bottom: 1px solid #ececec;
    flex-shrink: 0;
  }
`

