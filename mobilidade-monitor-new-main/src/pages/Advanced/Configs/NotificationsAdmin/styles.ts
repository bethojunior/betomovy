import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";

export const Container = styled.div`
  background-color: ${theme_colors.white};
  padding: 1rem;
  border-radius: 5px;
`;

export const ContentInput = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 440px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ContentTable = styled.div`
  margin: 1rem 0;
  overflow: auto;
  max-height: 600px;

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

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6rem;
`;
