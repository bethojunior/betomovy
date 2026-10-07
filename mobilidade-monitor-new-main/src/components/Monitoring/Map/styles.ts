import styled from "styled-components";
import { Button } from "antd";
import { AiOutlineArrowLeft, AiOutlineMenuUnfold } from "react-icons/ai";
import { MOBILE_BREAKPOINT, MOBILE_SPACING, UI_LAYER } from "../../../styles/layout-tokens";

export const ContainerOptionsMap = styled.div<MenuDesktopMap>`
  z-index: 1;
  position: absolute;
  margin-top: 10px;
  display: flex;
  justify-content: start;
  width: ${({ active }) => (active ? "71%" : "100%")};
  max-width: 100%;
  transition: 500ms;
  pointer-events: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
    margin-top: 6px;
  }
`;

export const ContainerButtons = styled.div<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  pointer-events: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    margin-left: 14px;
    gap: 6px;
    display: ${({ $expanded }) => ($expanded ? 'flex' : 'none')};
  }
`;

export const MobileFabToggle = styled.button`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: #000;
    border: none;
    box-shadow: 1px 3px 9px #565656;
    margin-bottom: 8px;
    margin-left: ${MOBILE_SPACING.mapFabLeftOffset}px;
    cursor: pointer;
    pointer-events: auto;
    font-size: 20px;
  }
`;

export const ButtonMenuDesktopMap = styled(Button)`
  border-radius: 100% !important;
  margin-left: 5px;
  box-shadow: 1px 1px 9px #565656;
  pointer-events: auto;
`;

type MenuDesktopMap = {
  active: boolean;
};

export const ContainerMenuDesktopMap = styled.div<MenuDesktopMap>`
  display: flex;
  flex-direction: column;
  height: 48%;
  display: ${(props) => (props.active ? "none" : "flex")};
  transition: 500ms;
  pointer-events: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`;

export const IconArrowLeft = styled(AiOutlineArrowLeft)`
  font-size: 25px !important;
  color: black;
`;

export const IconMenuTrips = styled(AiOutlineMenuUnfold)`
  font-size: 24px !important;
  margin-top: 1px;
  color: black;
`;

export const ButtonMap = styled(Button)`
  border-radius: 100%;
  margin-bottom: 10px;
  box-shadow: 1px 3px 9px #565656;
  pointer-events: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    margin-bottom: 0;
    font-size: 14px;

    .anticon,
    svg {
      font-size: 14px;
    }
  }
`;
export const MapModal = styled.div``;

export const NotificationButtonContainer = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  width: auto;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  pointer-events: none;
  z-index: ${UI_LAYER.mapNotification};

  > * {
    pointer-events: auto;
  }
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    top: 60px;
    right: 8px;
  }
`;

export const DesktopOnlyNotification = styled.div`
  display: contents;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`;

export const IconDriver = styled.img``;

export const ClientsButtonContainer = styled.div`
  position: relative;
  pointer-events: auto;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  left: 60px;
  top: 0;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  pointer-events: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: fixed;
    left: 50%;
    top: auto;
    bottom: 80px;
    transform: translateX(-50%);
    width: min(90vw, 320px);
    min-width: unset;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

export const DropdownMenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:active {
    background-color: #e6f7ff;
  }
`;

export const RouteLoader = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.35);
  pointer-events: none;
`;

export const RouteLoaderContent = styled.div`
  background: rgba(255, 255, 255, 0.98);
  padding: 12px 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  font-size: 14px;
  pointer-events: auto;
`;

export const MapRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;

  .mapboxgl-map,
  .mapboxgl-canvas-container,
  .mapboxgl-canvas {
    width: 100% !important;
    height: 100% !important;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    .mapboxgl-ctrl-bottom-right,
    .mapboxgl-ctrl-bottom-left {
      display: none;
    }
  }
`;

export const MapViewport = {
  height: "100%",
  width: "100%",
  position: "relative" as const,
};
