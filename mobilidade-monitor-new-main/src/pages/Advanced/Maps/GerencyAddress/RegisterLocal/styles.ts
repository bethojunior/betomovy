import styled from "styled-components";

interface ButtonProps {
  backgrounButton: string;
}

export const Container = styled.div``;

export const ContentHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const ContentBtnAddAddress = styled.div`
  max-width: 320px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ContentSearch = styled.div`
  margin: 1rem 0;
  max-width: 320px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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

export const Button = styled.button<ButtonProps>`
  padding: 0.3rem 0.6rem;
  border: none;
  background-color: ${({ backgrounButton }) => backgrounButton};
  color: #ffffff;
  border-radius: 5px;

  svg {
    margin-top: 5px;
  }
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: end;
  margin: 15px 0;

  .ant-pagination-options {
    display: none !important;
  }
`;
