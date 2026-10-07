import styled from "styled-components";
import { Spin } from 'antd';

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
  margin: 1rem 0;
  .ant-table-tbody > tr > td {
    background-color: #ffffffff;
  }

  @media (max-width: 550px) {
    th {
      font-size: 12px;
    }

    td {
      font-size: 12px;
    }
  }
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${({ color }) => color};
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 5px;
`;

export const ContentTable = styled.div`
  margin: 1rem 0;
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
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;
