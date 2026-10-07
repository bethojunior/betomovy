import { Button, Form as FormAntd } from "antd";
import styled from "styled-components";
import { Spin } from 'antd';

interface ButtonProps {
  visible: boolean;
}

export const Content = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
`;

export const ButtonListPrePaid = styled(Button)<ButtonProps>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  margin-left: 10px;
`;

export const ContentTable = styled.div`
  overflow: auto;
  margin: 1rem 0;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;

export const Form = styled(FormAntd)``
export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;