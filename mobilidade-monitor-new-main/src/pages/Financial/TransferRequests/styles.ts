import styled from "styled-components";
import { Menu } from "antd";

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
  .ant-table-tbody > tr > td {
    background-color: #ffffffff;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
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
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${({ color }) => color};
  color: #ffffff;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
`;

export const ContentFilters = styled.form`
  margin: 1rem 0;
`;

export const ContentInput = styled.div`
  width: 100%;
`;

export const LabelText = styled.p``;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ItemMenuSettings = styled(Menu.Item)`
  margin-top: 0px;
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
