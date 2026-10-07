import { Button } from "antd";
import styled from "styled-components";

export const DriverPopoverContent = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DriverAvatarWrapper = styled.div`
  width: 100%;
  height: 210px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  margin-bottom: 8px;
`;

export const DriverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DriverName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  text-align: center;
`;

export const VehicleInfoList = styled.div`
  width: 100%;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  padding-top: 6px;
`;

export const VehicleInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 12px;

  span:first-child {
    color: #8c8c8c;
  }

  span:last-child {
    color: #262626;
    font-weight: 500;
  }
`;

export const NotifyButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  background: #262626;
  border-color: #262626;

  &:hover,
  &:focus {
    background: #000;
    border-color: #000;
  }
`;

export const PopoverTrigger = styled.div`
  cursor: pointer;
  display: inline-block;
`;

export const popoverOverlayStyle = { pointerEvents: "auto" as const };
