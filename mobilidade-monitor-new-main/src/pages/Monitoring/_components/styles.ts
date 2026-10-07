import styled, { keyframes } from "styled-components";
import { FiHelpCircle } from "react-icons/fi";
import { MOBILE_BREAKPOINT, MOBILE_SPACING, UI_LAYER } from "../../../styles/layout-tokens";

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {background-position: -200px 0;}
  100% {background-position: 200px 0;}
`;

type FooterBarProps = {
  showTripsColumn: boolean;
};

export const FooterBar = styled.div<FooterBarProps>`
  position: fixed;
  bottom: 0;
  background-color: transparent;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease, left 0.3s ease;
  overflow: visible;
  z-index: ${UI_LAYER.footerBase};
  min-height: 20px;
  max-height: none;

  /* Desktop grande: respeitar sidebar quando aberto (xl={7} = 29.2%) */
  @media (min-width: 1367px) {
    left: ${({ showTripsColumn }) => (showTripsColumn ? '29.2%' : '0')};
    width: ${({ showTripsColumn }) => (showTripsColumn ? '70.8%' : '100%')};
    right: 0;
    min-width: ${({ showTripsColumn }) => (showTripsColumn ? '70.8%' : '100%')};
    max-width: none;
  }

  /* Desktop médio e menor: já expandir para ocupar tela toda antes dos cards espremerem */
  @media (max-width: 1366px) {
    width: 100% !important;
    min-width: 100% !important;
    left: 0 !important;
    right: 0 !important;
    max-width: none;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    pointer-events: none;

    > * {
      pointer-events: auto;
    }
  }
`;

export const FooterReloadButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  position: absolute;
  top: 0px;
  right: 12px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &.rotating svg {
    animation: ${rotate} 1s linear infinite;
  }

  &:hover {
    background: #0056b3;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: static;
    align-self: flex-end;
    padding: 6px 12px;
    font-size: 13px;
  }
`;


export const FooterToggleButton = styled.button<{ $hidden?: boolean }>`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  position: absolute;
  top: -25px;
  padding: 5px 10px;
  cursor: pointer;
  z-index: ${UI_LAYER.footerContent};
  white-space: nowrap;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: fixed;
    top: auto;
    bottom: ${MOBILE_SPACING.floatingBottom}px;
    left: ${MOBILE_SPACING.floatingLeft}px;
    right: auto;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: ${UI_LAYER.footerOverlayControls};
    display: ${({ $hidden }) => ($hidden ? 'none' : 'inline-flex')};
  }
`;

export const FooterFilterContainer = styled.div<{ $hidden?: boolean }>`
  position: absolute;
  top: -28px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: ${UI_LAYER.footerContent};

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: fixed;
    top: auto;
    bottom: ${MOBILE_SPACING.floatingBottom}px;
    right: ${MOBILE_SPACING.floatingRightWithSupportBubble}px;
    background: rgba(255, 255, 255, 0.92);
    padding: 4px;
    border-radius: 999px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    z-index: ${UI_LAYER.footerOverlayControls};
    display: ${({ $hidden }) => ($hidden ? 'none' : 'flex')};
  }
`;

export const FooterFilterButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#0b66c3' : '#e6eef8')};
  color: ${({ $active }) => ($active ? '#fff' : '#0b66c3')};
  border: 1px solid ${({ $active }) => ($active ? '#0b66c3' : '#b9cbe3')};
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => ($active ? '#0959a8' : '#d9e7f7')};
  }
`;

export const ButtonContainerReload = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  width: 100%;
  margin:  0 auto;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 4px;
  }
`;

export const ReloadText = styled.span`
  color: #666;
  position: absolute;
  top: 4px;
  right: 56px;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: static;
    text-align: right;
    font-size: 12px;
  }
`;

export const DriverStatusContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  top: 4px;
  left: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: static;
    flex: 1 1 100%;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    flex-wrap: nowrap;
    white-space: nowrap;
  }
`;

export const FooterContent = styled.div<{ $dropdownOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  overflow: visible;
  gap: 16px;
  position: relative;
  padding: 20px 15px;
  z-index: ${UI_LAYER.footerContent};
  background-color: rgb(236, 236, 236);
  border-top: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
  min-height: auto;
  box-sizing: border-box;
  margin: 0;

  @media (max-width: 1024px) {
    padding: 18px 12px;
    gap: 12px;
  }

  @media (max-width: 900px) {
    padding: 15px 10px;
    gap: 12px;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 14px 10px 64px;
    gap: 10px;
    max-height: 60vh;
    max-height: 60dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* Acima do DropdownBackdrop (footerDropdownBackdrop): senão o backdrop captura toque em WhatsApp/Ver detalhes */
    z-index: ${({ $dropdownOpen }) =>
      $dropdownOpen ? UI_LAYER.footerDropdownContent : 0};
  }

  @media (max-width: 768px) {
    padding: 14px 10px 64px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px 64px;
    gap: 8px;
  }
`;

export const StatCardContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 100%;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: visible;
  z-index: ${UI_LAYER.footerCards};
  box-sizing: border-box;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    z-index: auto;
  }
`;

export const CardsWrapper = styled.div`
  display: flex;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  justify-content: center;
  align-items: stretch;
  position: relative;
  overflow: visible;
  gap: 10px;
  flex-wrap: nowrap;
  box-sizing: border-box;
  
  @media (max-width: 1400px) {
    gap: 8px;
  }
  
  @media (max-width: 1200px) {
    gap: 8px;
  }
  
  @media (max-width: 1024px) {
    gap: 10px;
    flex-wrap: wrap;
    overflow-x: visible;
  }
  
  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: wrap;
    overflow-x: visible;
    justify-content: stretch;
  }

  @media (max-width: 480px) {
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const BaseCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: auto;
  min-width: 160px;
  flex: 1 1 0;
  max-width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: visible;
  word-wrap: break-word;
  box-sizing: border-box;

  @media (min-width: 1401px) {
    min-width: 160px;
    max-width: 250px;
  }

  @media (max-width: 1400px) {
    min-width: 150px;
    max-width: 220px;
  }

  @media (max-width: 1200px) {
    min-width: 140px;
    max-width: 200px;
    padding: 10px 14px;
  }

  @media (max-width: 1024px) {
    min-width: 130px;
    max-width: 180px;
    padding: 10px 12px;
  }

  @media (max-width: 768px) {
    min-width: calc(50% - 6px);
    max-width: none;
    flex: 1 1 calc(50% - 6px);
    padding: 10px 12px;
  }

  @media (max-width: 600px) {
    min-width: calc(50% - 6px);
    max-width: none;
    flex: 1 1 calc(50% - 6px);
    padding: 9px 10px;
  }

  @media (max-width: 480px) {
    min-width: calc(50% - 4px);
    max-width: none;
    flex: 1 1 calc(50% - 4px);
    padding: 8px 10px;
  }

  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    color: black;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    width: 100%;
    line-height: 1.3;
    
    @media (max-width: 1400px) {
      font-size: 17px;
    }
    
    @media (max-width: 1024px) {
      font-size: 15px;
      margin-bottom: 6px;
      line-height: 1.25;
    }
    
    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    
    @media (max-width: 480px) {
      font-size: 13px;
      margin-bottom: 4px;
      line-height: 1.15;
    }
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #555;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    width: 100%;
    line-height: 1.4;
    
    @media (max-width: 1400px) {
      font-size: 15px;
    }
    
    @media (max-width: 1024px) {
      font-size: 14px;
      line-height: 1.3;
    }
    
    @media (max-width: 768px) {
      font-size: 13px;
      line-height: 1.25;
    }
    
    @media (max-width: 480px) {
      font-size: 12px;
      line-height: 1.2;
    }
  }

  &:hover {
    background: #e9ecef;
  }
`;

export const StatCard = styled(BaseCard)`
  /* Todos os cards agora têm o mesmo tamanho */
`;

export const StatusDriversContainer = styled.div`
  position: absolute;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  width: 100%;
  top: 0;
`;
export const StatusDriversText = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
  text-align: center;
  white-space: nowrap;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 12px;
  }
`;

export const StatCardSmall = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: calc(100% / 6.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
  }

  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    color: black;
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #555;
  }
`;


export const StatCardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;

  p {
    margin: 0;
    font-size: 14px;
    color: #555;
    line-height: 1.3;
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    hyphens: auto;
    width: 100%;
    
    @media (max-width: 1400px) {
      font-size: 13px;
    }
    
    @media (max-width: 1024px) {
      font-size: 12px;
      line-height: 1.25;
    }
    
    @media (max-width: 768px) {
      font-size: 11px;
      line-height: 1.2;
    }
    
    @media (max-width: 480px) {
      font-size: 10px;
      line-height: 1.15;
    }
  }

  &.three-items {
    grid-template-columns: 1fr 1fr;
    
    p:nth-child(3) {
      grid-column: 1 / 2;
      grid-row: 2;
    }
  }

  &.column-layout {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const DropdownCard = styled(BaseCard)<{ $open?: boolean }>`
  position: relative;
  cursor: pointer;
  z-index: ${UI_LAYER.footerContent};

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    z-index: ${({ $open }) => ($open ? UI_LAYER.footerDropdownCardOpen : 'auto')};
  }
`;

export const HelpIcon = styled(FiHelpCircle)`
  margin-left: 4px;
  vertical-align: middle;
  color: #888;
  cursor: help;
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 8px 8px 0 0;
  z-index: 1;

  h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: #222;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 16px;
    line-height: 1;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;

    &:hover {
      color: #000;
      background: #f0f0f0;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 14px 16px 10px;
    border-radius: 16px 16px 0 0;

    h4 {
      font-size: 15px;
    }

    button {
      padding: 6px;
      font-size: 20px;
    }
  }
`;

export const DropdownBackdrop = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: ${UI_LAYER.footerDropdownBackdrop};
    pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  }
`;

export const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: ${UI_LAYER.footerCards};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(10px)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  margin-bottom: 8px;
  width: clamp(300px, 34vw, 380px);

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: fixed;
    inset: auto 0 0 0;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    min-width: 0;
    margin: 0;
    border-radius: 16px 16px 0 0;
    max-height: 70vh;
    max-height: 70dvh;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(100%)')};
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.25);
    z-index: ${UI_LAYER.footerDropdownContent};
    -webkit-overflow-scrolling: touch;
  }
`;

export const TripDetailItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 12px 14px;
    gap: 10px;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

export const TripInfo = styled.div`
  flex: 1;
  text-align: left;
  min-width: 0;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SkeletonText = styled.span<{width?: string}>`
  display: inline-block;
  height: 12px;
  width: ${({ width }) => width || '60px'};
  border-radius: 4px;
  background: #ececec;
  background-image: linear-gradient(
    to right,
    #ececec 0%,
    #f5f5f5 20%,
    #ececec 40%,
    #ececec 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s linear infinite;
`;

export const TripTime = styled.div`
  display: inline-flex;
  font-size: 11px;
  color: #555;
  font-weight: 600;
  background: #f1f3f5;
  border-radius: 999px;
  padding: 2px 8px;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const TripParticipant = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const CanceledByTag = styled.span<{ $type?: string }>`
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  vertical-align: middle;
  background: ${({ $type }) =>
    $type === 'driver' ? '#fff3cd' : $type === 'admin' ? '#e2e3e5' : '#d1e7dd'};
  color: ${({ $type }) =>
    $type === 'driver' ? '#856404' : $type === 'admin' ? '#41464b' : '#0f5132'};
`;

export const TripReason = styled.div`
  font-size: 12px;
  color: #666;
  font-style: italic;
  word-break: break-word;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const TripRoute = styled.div`
  font-size: 12px;
  color: #555;
  margin-top: 6px;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.4;

  strong {
    color: #333;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const RouteTrack = styled.div`
  position: relative;
`;

/** Linha única tracejada, atrás dos dois pontos, do centro do 1º ao centro do último — não quebra mesmo se o endereço virar 2 linhas. */
export const RouteLine = styled.div`
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 3.5px;
  border-left: 2px dashed #c9c9c9;
`;

export const RouteRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  & + & {
    margin-top: 8px;
  }
`;

export const RouteMarker = styled.span<{ $variant: 'origin' | 'destination' }>`
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  background: ${({ $variant }) => ($variant === 'origin' ? '#2f6fed' : '#e6484b')};
`;

export const RouteText = styled.div`
  flex: 1;
  min-width: 0;
  white-space: normal;
`;

export const TripPrice = styled.div`
  font-size: 15px;
  color: #1a8a45;
  font-weight: 700;
  margin-top: 6px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const TripOptionsLabel = styled.div`
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
`;

export const TripOptionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TripOptionPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
`;

export const TripOptionChip = styled.div`
  font-size: 12px;
  color: #1f3a8a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 6px;
  background: #eef2ff;
  border: 1px solid #dde4ff;
  border-radius: 12px;
  padding: 4px 10px;
`;

export const TripOptionPrice = styled.span`
  font-weight: 700;
  color: #0d6efd;
`;

export const TripOptionsToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  color: #0d6efd;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;
  }

  &.expanded svg {
    transform: rotate(180deg);
  }
`;


export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: row;
    align-self: stretch;
    justify-content: flex-start;
    align-items: center;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
    gap: 10px;
    flex-wrap: nowrap;
    min-width: 0;
  }
`;

export const DetailsLink = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 12px;
    min-height: 32px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid #cfe2ff;
    background: #f4f8ff;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    padding: 6px 8px;
  }
`;

export const WhatsAppButton = styled.button`
  background: #25d366;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #128c7e;
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;
