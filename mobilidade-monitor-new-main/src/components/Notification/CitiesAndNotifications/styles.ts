import type { CSSProperties } from "react";
import styled from "styled-components";
import { Button, Select } from "antd";
import { BsBell } from "react-icons/bs";
import { MOBILE_BREAKPOINT } from "../../../styles/layout-tokens";

export const citySelectDropdownStyle: CSSProperties = {
  transition: "min-width 0.9s ease-in-out",
};

export const GeneralContainer = styled.div`
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
   @media (max-width: 768px) {
    padding-right: 0;
  }
`;

export const DesktopToolbarRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const DesktopToolbarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

export const SelectNotFoundLoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

export const SelectedAreaDesktopChip = styled.div`
  background: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
`;

export const SelectedAreaDesktopChipName = styled.span`
  margin-right: 15px;
`;

type AreaChipDismissButtonProps = {
  $compact?: boolean;
};

export const AreaChipDismissButton = styled(Button)<AreaChipDismissButtonProps>`
  padding: 0 !important;
  min-width: auto !important;
  height: auto !important;
  ${(props) => (props.$compact ? "flex-shrink: 0;" : "")}
`;

export const SelectCities = styled(Select)`
  min-width: 150px;
  margin-top: 0;
  margin-right: 4px;

  .ant-select-selector {
    height: 38px !important;
    align-items: center;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 20px !important;
    color: #FFFFFF !important;
    padding: 0 14px !important;
    transition: all 0.2s ease !important;

    &:hover {
      border-color: #04F3FA !important;
      background: rgba(255, 255, 255, 0.12) !important;
    }
  }

  .ant-select-selection-item {
    color: #FFFFFF !important;
    font-weight: 600;
  }

  .ant-select-arrow {
    color: #CBD5E1 !important;
  }

  @media (max-width: 800px) {
    min-width: 110px;
    .ant-select-selector {
      font-size: 13px !important;
      height: 34px !important;
    }
  }
`;

/** Participates in parent CSS grid (`display: contents` on parent). Bell in row 1, col 3. */
export const MonitoringNavExtension = styled.div`
  display: contents;
`;

export const MonitoringNavBellCell = styled.div`
  grid-column: 3;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`;

export const MonitoringNavCityCell = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: 100%;
`;

export const MonitoringSelectedAreaChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
  background: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  font-size: 13px;
`;

export const MonitoringSelectedAreaChipLabel = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** Full-width city select for Monitoring mobile navbar second row; long names ellipsis. */
export const SelectCitiesMobileMonitoring = styled(SelectCities)`
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100%;
  margin-top: 0 !important;
  margin-right: 0 !important;

  .ant-select-selector {
    height: 36px !important;
    max-width: 100%;
  }

  .ant-select-selection-item {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    max-width: 100%;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100% !important;
  }
`;

type AlertButtonProps = {
  active: boolean;
};

export const AlertButton = styled.div<AlertButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 38px;
  max-height: 38px;
  min-width: 38px;
  max-width: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #CBD5E1;
  outline: none;
  z-index: 300;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #111111 !important;
    color: #04F3FA !important;
    border-color: #04F3FA !important;
    box-shadow: 0 0 12px rgba(4, 243, 250, 0.3);
  }

  ${({ active }) =>
    active === true ? `animation: 1.5s notificationColor linear infinite` : ""}
`;

export const BellIcon = styled(BsBell)`
  font-size: 25px;
`;

/** Sino no canto do navbar mobile (sem margens laterais grandes). */
export const MonitoringNavAlertButton = styled(AlertButton)`
  margin: 0;
`;