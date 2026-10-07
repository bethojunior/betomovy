import styled from "styled-components";
import { theme_colors } from "../../../theme/theme";

export const Container = styled.div`
  padding-bottom: 4rem;
`;

export const ContentTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme_colors.gray} !important;
    border-radius: 5px !important;
  }

  td {
    background-color: ${theme_colors.white};
  }
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const ContentButtonAddVersion = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const ContentGraphicsVersions = styled.div`
  width: 100%;
  background-color: #292929;
  display: flex;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme_colors.gray} !important;
    border-radius: 5px !important;
  }

  .css-1blkw4v-MuiResponsiveChart-container {
    padding-left: 4.5rem;
    height: 150px !important;
  }

  .css-1u0lry5-MuiChartsLegend-root {
    display: none;
  }

  > div {
    max-width: 400px;
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h3 {
      color: ${theme_colors.white};
    }
  }
`;

export const AlertMessage = styled.p<{ $color?: string }>`
  color: ${({ $color }) => $color ?? theme_colors.white};
  font-size: 14px;
  text-align: center;
  margin: 0;
`;
