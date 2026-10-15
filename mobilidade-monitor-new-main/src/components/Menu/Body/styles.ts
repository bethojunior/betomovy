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
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;

  > aside {
    overflow-y: auto;
  }

  > section {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto !important;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.15);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.45);
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
  padding: 0 1rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const User = styled.div`
  display: block;
  text-align: center;
`;

export const PaymentButton = styled(Button)`
  width: 80%;
  margin-top: 10px;
  height: 36px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  color: #fff !important;
  border: none !important;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
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
  padding: 14px 10px 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

  .profile-user {
    width: ${(props) => (props.collapsed ? "42px" : "80px")};
    height: ${(props) => (props.collapsed ? "42px" : "80px")};
    border-radius: 50%;
    margin: 6px 0 10px 0;
    transition: 300ms;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .user-data {
    opacity: ${(props) => (props.collapsed ? "0" : "1")};
    overflow: hidden;
    max-height: ${(props) => (props.collapsed ? "0px" : "200px")};
    transition: 300ms;
    font-size: 13px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.85);

    > div:first-child {
      font-weight: 600;
      color: #ffffff;
      font-size: 14px;
    }
  }
`;

export const Logo = styled.div`
  height: 15vh;
  background-image: url("https://images-na.ssl-images-amazon.com/images/I/51Sa3eXCl9L.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50px;
`;
