import styled from "styled-components";

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
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
  border: none;
  border-radius: 5px;
  padding: 0.5rem 0.8rem;
`;
