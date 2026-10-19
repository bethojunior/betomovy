import styled from "styled-components";
import { Button, Layout, Typography } from "antd";
import { AiOutlineArrowLeft } from "react-icons/ai";

const { Sider } = Layout;
const { Title } = Typography;

type SiderProps = {
  menumobile: boolean;
  collapsed: boolean;
};

export const Container = styled(Layout)`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex !important;
  flex-direction: row !important;

  > aside {
    overflow-y: auto;
    flex-shrink: 0;
  }

  > section {
    height: 100vh;
    overflow: hidden;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
    min-width: 0 !important;
  }

  .trigger {
    font-size: 23px;
    color: #fff;
  }
  .trigger:hover {
    color: #1d8efa;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const TitleMenu = styled(Title)`
  font-weight: normal !important;
  color: #ffffff !important;
  font-size: 18px !important;
  margin: 0 !important;

  @media (max-width: 425px) {
    font-size: 16px !important;
  }
`;

export const SiderMenu = styled(Sider)<SiderProps>`
  height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #070A1A 0%, #0A1128 100%) !important;
  border-right: 1px solid rgba(4, 243, 250, 0.08);

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto !important;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(4, 243, 250, 0.2) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(4, 243, 250, 0.2);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(4, 243, 250, 0.5);
    }
  }

  @media (max-width: 768px) {
    height: 100vh;
    position: absolute;
    z-index: 10000000;
    width: 100% !important;
    max-width: ${({ collapsed }) =>
      collapsed ? "0px !important" : "100% !important"};
    width: 100%;
    min-width: 0px !important;
  }
`;

type ButtonBackProps = {
  visible: boolean;
  collapsed: boolean;
};

export const CloseButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10000001;

  svg {
    color: #fff;
    font-size: 24px;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;
export const ButtonBack = styled.button<ButtonBackProps>`
  display: ${(props) => (props.visible && !props.collapsed ? "block" : "none")};
  left: 0;
  margin-top: 10px;
  margin-left: 5px;
  position: absolute;
  background: none;
  border: none;
`;

export const IconArrowLeft = styled(AiOutlineArrowLeft)`
  font-size: 30px;
  color: white;
`;

export const HeaderLayout = styled(Layout.Header)`
  padding: 0 1.5rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #070A1A !important;
  border-bottom: 1px solid rgba(4, 243, 250, 0.12);
  height: 64px;
`;

export const User = styled.div`
  display: block;
  text-align: center;
  margin-top: 6px;

  .user-name {
    font-weight: 700;
    color: #FFFFFF;
    font-size: 13.5px;
    letter-spacing: -0.2px;
  }

  .user-role {
    font-size: 11.5px;
    color: #04F3FA;
    font-weight: 600;
    margin-top: 2px;
  }
`;

export const PaymentButton = styled(Button)`
  width: 85%;
  margin-top: 12px;
  height: 36px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff !important;
  border: none !important;
  transition: all 0.2s ease;

  &:hover {
    background-color: #111111 !important;
    color: #04F3FA !important;
  }

  span {
    color: #fff !important;
  }
`;

interface HeadSideProps {
  collapsed: boolean;
  menuMobile: boolean;
}

export const HeadSider = styled.div<HeadSideProps>`
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.collapsed ? "16px 8px" : "20px 14px 16px")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #070A1A;
  flex-shrink: 0;

  .brand-logo-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;

    .movy-brand-logo {
      height: ${(props) => (props.collapsed ? "28px" : "42px")};
      width: auto;
      max-width: ${(props) => (props.collapsed ? "38px" : "150px")};
      object-fit: contain;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
      transition: all 0.3s ease;
    }
  }

  .user-data {
    opacity: ${(props) => (props.collapsed ? "0" : "1")};
    overflow: hidden;
    max-height: ${(props) => (props.collapsed ? "0px" : "200px")};
    transition: 300ms;
  }
`;

export const Logo = styled.div`
  display: none;
`;
