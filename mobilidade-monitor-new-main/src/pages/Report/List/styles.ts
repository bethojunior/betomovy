import styled from "styled-components";
import { Button, Input, Select } from "antd";
import { Spin } from 'antd';

const { Search } = Input;

export const Title = styled.p`
  margin-bottom: 0.2rem;
`;

export const Header = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #d3d3d3;

  @media (max-width: 800px) {
    flex-direction: column;
    margin: 0 1rem;
  }
`;

export const Section = styled.div`
  margin: 0.5rem 0;

  @media (max-width: 800px) {
    margin-right: 0;
  }
`;

export const SelectSearch = styled(Select)`
  width: 200px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const InputSearch = styled(Input)`
  width: 200px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const DoSearch = styled(Search)`
  width: 200px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

type TableProp = {
  visible: boolean;
};

export const TableContent = styled.div<TableProp>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  padding-bottom: 20px;
  .ant-pagination {
    display: none;
  }

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

export const ContentPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PaginationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  &:last-child {
    margin-left: 5px;
  }
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;