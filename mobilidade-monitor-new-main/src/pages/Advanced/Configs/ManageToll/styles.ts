import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";

export const Container = styled.div``;

export const ContentHeaderButton = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

export const ContentBtnActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
