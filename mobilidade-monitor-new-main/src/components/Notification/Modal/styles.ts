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

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const FiltersInput = styled.div`
  display: flex;

  &:first-child {
    margin-bottom: 10px;
  }

  p {
    margin-right: 20px;
  }

  Radio {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    gap: 6px;

    p {
      margin-right: 0;
      margin-bottom: 0;
      white-space: nowrap;
    }

    .ant-select {
      width: 100% !important;
      min-width: 0 !important;
    }

    .ant-radio-group {
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      overflow-x: auto;
      gap: 10px;
      justify-content: flex-start;
      scrollbar-width: thin;
      width: 100%;
    }

    .ant-radio-wrapper {
      margin-right: 0 !important;
      flex: 0 0 auto;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
    }

    .ant-radio-wrapper > span:last-child {
      white-space: nowrap;
    }
  }
`;

export const ButtonIcon = styled(Button)`
  font-size: 20px;
  margin-bottom: 5px;
`;

export const ContentButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 10px;
  margin-bottom: -40px;

  .ant-btn {
    white-space: nowrap;
    min-width: 120px;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    margin-bottom: 0;

    .ant-btn {
      width: auto;
      max-width: 100%;
      white-space: nowrap;
    }
  }
`;

type ListProps = {
  size: NotificationProps[];
};

export const ListContent = styled.div<ListProps>`
  height: ${({ size }) => (size?.length === 0 ? "auto" : "450px")};
  overflow: scroll;
  padding-right: 10px;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    height: ${({ size }) => (size?.length === 0 ? "auto" : "36dvh")};
    max-height: 36dvh;
    padding-right: 4px;
  }
`;

export const WithoutNotificationContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const WithoutNotification = styled.p`
  margin-bottom: 0;
  font-size: 15px;
`;

export const Content = styled(Modal)`
  .ant-modal {
    max-width: 92vw;
  }

  .ant-modal-content {
    overflow: hidden;
  }

  .ant-modal-header {
    padding-right: 40px;
  }

  .ant-modal-body {
    padding-right: 20px !important;
    padding-left: 20px !important;
    padding-bottom: 0 !important;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
  }

  @media (max-width: 800px) {
    .ant-modal-wrap {
      overflow: hidden;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-modal {
      top: 0;
      width: calc(100vw - 16px) !important;
      max-width: calc(100vw - 16px) !important;
      margin: 0 auto;
      padding-bottom: 0;
    }

    .ant-modal-content {
      border-radius: 12px;
      max-height: calc(100dvh - 16px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ant-modal-body {
      padding: 12px !important;
      max-height: calc(100dvh - 180px);
      overflow-y: auto;
    }

    .ant-modal-footer {
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;

      .ant-btn {
        width: 100%;
        margin: 0 !important;
      }
    }
  }
  position: relative;
`;

export const LinkButton = styled(Button)`
  padding-left: 0;
`;
