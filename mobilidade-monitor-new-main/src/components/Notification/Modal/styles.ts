import styled from "styled-components";
import { Button, Modal } from "antd";
import { NotificationProps } from "../CitiesAndNotifications/types";
import { MOBILE_BREAKPOINT } from "../../../styles/layout-tokens";

type VisibilityNotification = {
  visible: boolean;
};

export const Container = styled.div<VisibilityNotification>`
  width: ${(props) => (props.visible ? "100%" : "0px")};
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  gap: 16px;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    flex-wrap: wrap;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px;

    > div:first-child {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
  }
`;

export const FiltersInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }

  .ant-select {
    min-width: 170px;
    border-radius: 8px;
  }

  .ant-radio-group {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .ant-radio-wrapper {
    font-size: 13px;
    color: #334155;
    font-weight: 500;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;

    .ant-select {
      width: 100% !important;
      min-width: 0 !important;
    }

    .ant-radio-group {
      width: 100%;
      justify-content: flex-start;
      gap: 14px;
    }
  }
`;

export const ButtonIcon = styled(Button)`
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #00349A !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  font-size: 18px !important;
  cursor: pointer;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 6px rgba(0, 52, 154, 0.2) !important;

  &:hover {
    background: #002570 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 52, 154, 0.3) !important;
  }
`;

export const ContentButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 10px;

  .ant-btn {
    white-space: nowrap;
    min-width: 120px;
    border-radius: 8px;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    .ant-btn {
      width: 100%;
    }
  }
`;

type ListProps = {
  size: NotificationProps[];
};

export const ListContent = styled.div<ListProps>`
  height: ${({ size }) => (size?.length === 0 ? "auto" : "460px")};
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F1F5F9;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    height: ${({ size }) => (size?.length === 0 ? "auto" : "50dvh")};
    max-height: 50dvh;
    padding-right: 2px;
  }
`;

export const WithoutNotificationContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  color: #64748B;
`;

export const WithoutNotification = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
`;

export const Content = styled(Modal)`
  .ant-modal {
    max-width: 650px;
  }

  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #E2E8F0;
  }

  .ant-modal-header {
    background: #001529;
    padding: 18px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .ant-modal-title h3 {
      color: #FFFFFF !important;
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
  }

  .ant-modal-close {
    color: rgba(255, 255, 255, 0.8) !important;
    top: 18px;
    right: 20px;

    &:hover {
      color: #FFFFFF !important;
    }
  }

  .ant-modal-body {
    padding: 20px 24px 10px 24px !important;
    background: #FFFFFF;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding: 14px 24px;
    background: #F8FAFC;
    border-top: 1px solid #E2E8F0;

    .ant-btn {
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      height: 36px;
      padding: 0 16px;
    }

    .ant-btn-primary {
      background: #00349A;
      border-color: #00349A;

      &:hover {
        background: #002570;
        border-color: #002570;
      }
    }
  }

  @media (max-width: 800px) {
    .ant-modal-wrap {
      padding: 10px;
    }

    .ant-modal {
      width: calc(100vw - 20px) !important;
      max-width: 100% !important;
      margin: 0 auto;
    }

    .ant-modal-body {
      padding: 14px !important;
    }

    .ant-modal-footer {
      padding: 12px 14px;
      flex-direction: column-reverse;

      .ant-btn {
        width: 100%;
        margin: 0 !important;
      }
    }
  }
`;

export const LinkButton = styled(Button)`
  padding-left: 0;
`;
