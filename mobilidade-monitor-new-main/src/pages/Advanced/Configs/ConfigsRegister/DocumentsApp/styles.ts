import styled from "styled-components";
import { theme_colors } from "../../../../../theme/theme";

export const Container = styled.div``;

export const ContentButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const ContentTable = styled.div`
  overflow: auto;

  td {
    background-color: ${theme_colors.white};
  }

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

export const ContentButtonActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;
