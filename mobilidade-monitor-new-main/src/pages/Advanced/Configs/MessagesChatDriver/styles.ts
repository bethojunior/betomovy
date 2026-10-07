import styled from "styled-components";

interface ButtonTableProps {
  colorButton: string;
}

export const Container = styled.div``;

export const ContentHead = styled.div`
  margin: 1rem 0;
`;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;
export const LabelText = styled.p``;

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

export const ButtonTable = styled.button<ButtonTableProps>`
  display: flex;
  border: none;
  background: none;
  font-size: 20px;
  color: ${({ colorButton }) => colorButton};
`;
