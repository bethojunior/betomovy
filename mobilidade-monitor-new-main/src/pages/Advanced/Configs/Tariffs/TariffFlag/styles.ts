import styled from "styled-components";

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
  margin: 1rem 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${({ color }) => color};
  padding: 0.5rem 0.7rem;
  border-radius: 5px;
  color: #ffffff;
  border: none;
`;

export const ContentButtonNewTrigger = styled.div`
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
