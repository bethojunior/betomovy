import styled from "styled-components";

interface ButtonActionsProps {
  backgroundButton: string;
}

export const Container = styled.div``;

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
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ButtonActions = styled.button<ButtonActionsProps>`
  padding: 0.3rem 0.8rem;
  background-color: ${({ backgroundButton }) => backgroundButton};
  border: none;
  border-radius: 5px;

  svg {
    margin-top: 5px;
  }
`;
