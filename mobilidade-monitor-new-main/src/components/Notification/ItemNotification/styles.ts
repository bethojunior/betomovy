import { Button } from "antd";
import styled from "styled-components";

export const Content = styled.div<{ $isRead?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) => (props.$isRead ? "#FFFFFF" : "#F8FAFC")};
  border: 1px solid ${(props) => (props.$isRead ? "#E2E8F0" : "#BAE6FD")};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  gap: 12px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #93C5FD;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  @media (max-width: 800px) {
    gap: 10px;
    padding: 12px;
    margin-bottom: 8px;
  }
`;

export const UnreadBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0284C7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
`;

export const AvatarWrap = styled.div<{ $bg?: string; $color?: string }>`
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$bg || "#EFF6FF"};
  color: ${(props) => props.$color || "#2563EB"};
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
    font-size: 18px;
  }
`;

export const Image = styled.img`
  object-fit: cover;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  background: #F1F5F9;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
  }
`;

export const NotificationTitle = styled.h3`
  font-weight: 700;
  margin-bottom: 4px;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.35;
  color: #0F172A;
  padding-right: 20px;
`;

export const CityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #F1F5F9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  width: fit-content;
  border: 1px solid #E2E8F0;
`;

export const NotificationMessage = styled.div`
  word-break: break-word;
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 1.45;
  color: #475569;
  margin-bottom: 6px;

  p {
    margin-bottom: 4px;
  }
`;

export const NotificationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #F1F5F9;
`;

export const NotificationDate = styled.span`
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
`;

export const ButtonIcon = styled(Button)`
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  background: #00349A !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 4px 12px !important;
  height: 28px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer;
  transition: all 0.2s ease !important;

  &:hover {
    background: #002570 !important;
    box-shadow: 0 2px 8px rgba(0, 52, 154, 0.25) !important;
    transform: translateY(-1px);
  }

  svg {
    font-size: 14px;
  }
`;

export const Video = styled.video`
  width: min(15rem, 100%);
  max-width: 100%;
  height: auto;
  max-height: 14rem;
  display: flex;
  margin: 6px 0;
  border-radius: 8px;
  object-fit: contain;
`;
