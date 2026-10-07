import styled from "styled-components";

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
  .ant-table-tbody > tr > td {
    background-color: #ffffffff;
  }
`;

export const ContentButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const ContentTable = styled.div`
  overflow: auto;
  ::-webkit-scrollbar {
    display: block;
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #bdbdbd;
  }
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${({ color }) => color};
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  border: none;
`;
