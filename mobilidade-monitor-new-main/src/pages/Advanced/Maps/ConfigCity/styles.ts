import styled from "styled-components";
import { Spin } from 'antd';

interface ButtonProps {
  backgroundColor: string;
}

export const Container = styled.div``;

export const Button = styled.button<ButtonProps>`
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  border: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const ContentTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  td {
    background-color: #ffffff;
  }
`;

export const ContentButton = styled.div`
  margin: 1rem 0;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;