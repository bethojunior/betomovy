import styled from "styled-components";

interface ButtonProps {
  background: string;
}

export const Container = styled.div``;

export const Button = styled.button<ButtonProps>`
  padding: 0.3rem 0.8rem;
  color: #ffffff;
  background-color: ${({ background }) => background};
  border: none;
  border-radius: 5px;
`;

export const ContentButton = styled.div`
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

  td {
    background-color: #ffffff;
  }
`;
