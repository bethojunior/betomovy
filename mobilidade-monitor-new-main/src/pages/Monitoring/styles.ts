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
  background: #f1f5f9;
`

type MenuMobileProps = {
  $active: boolean
}

export const MenuMobile = styled.div<MenuMobileProps>`
  width: 100%;
  background: #0f172a;
  padding: 8px 12px;
  flex-shrink: 0;
  z-index: 200;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
  ${(props) => (!props.$active ? `display: none` : '')}
`

export const LoadingTripContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #64748b;
  font-size: 13px;
`

export const LoadingMoreTripsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`

type OptionSelectedMenuMobile = {
  $active: boolean
}

export const OptionMenuMobile = styled(Button)<OptionSelectedMenuMobile>`
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')} !important;
  font-weight: 700;
  margin-top: 0;
  padding: 6px 14px !important;
  height: auto !important;
  font-size: 13px !important;
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 8px !important;
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.12)' : 'transparent')} !important;
  border: none !important;
  transition: all 0.2s ease;
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
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: relative;
  }
`

type ColumnTripsProps = {
  $active: boolean
}

export const ColumnTrips = styled(Col)<ColumnTripsProps>`
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  display: ${({ $active }) => ($active ? 'flex' : 'none')};
  z-index: 100;
  position: relative;
  box-sizing: border-box;
  box-shadow: 4px 0 20px rgba(15, 23, 42, 0.05);

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

  @media (min-width: 980px) and (max-width: 1200px) {
    max-width: ${({ $active }) => ($active ? '380px' : '0')};
    flex: ${({ $active }) => ($active ? '0 0 380px' : '0')};
  }

  @media (min-width: 1201px) {
    max-width: ${({ $active }) => ($active ? '420px' : '0')};
    flex: ${({ $active }) => ($active ? '0 0 420px' : '0')};
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
    ${(props) => (!props.$active ? `display: none;` : '')}
  }
`

export const IconArrowLeft = styled(AiOutlineArrowLeft)`
  font-size: 20px;
  color: #475569;
`

export const IconMenuTrips = styled(AiOutlineMenuUnfold)`
  font-size: 22px;
  color: #475569;
`

export const ContainerTrips = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  margin: 0;
  padding: 14px 16px 80px 16px;
  gap: 12px;
  box-sizing: border-box;

  /* Estilização suave da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

export const TripCardWrapper = styled.div<{ $removing?: boolean }>`
  flex-shrink: 0;
  overflow: visible;
  max-height: 2000px;
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms ease, transform 300ms ease, max-height 350ms ease;

  ${({ $removing }) =>
    $removing &&
    `
    overflow: hidden;
    opacity: 0;
    transform: scale(0.96);
    max-height: 0;
  `}
`

export const ContainerMenuDesktop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;

  .top-bar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
  }

  .brand-badge {
    display: flex;
    align-items: center;
    gap: 8px;

    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #0284c7;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .brand-text {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }
  }

  .filter-tabs-row {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 6px;
    background: #f8fafc;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .search-row {
    padding: 8px 12px;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`

export const ActiveTripsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const MobileNavGrid = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 8px;
  row-gap: 8px;
  width: 100%;
  padding: 4px 0 6px;
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
  gap: 4px;
  flex-wrap: nowrap;
  min-width: 0;
`

export const FilterButton = styled(Button)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? '#0284c7' : '#e2e8f0')} !important;
  background: ${({ $active }) => ($active ? '#e0f2fe' : '#ffffff')} !important;
  color: ${({ $active }) => ($active ? '#0284c7' : '#475569')} !important;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0284c7 !important;
    color: #0284c7 !important;
  }
`

export const ScheduledCounter = styled.span`
  background-color: #6366f1;
  color: #ffffff;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  text-align: center;
`

export const MobileScheduledBar = styled.div`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }
`
