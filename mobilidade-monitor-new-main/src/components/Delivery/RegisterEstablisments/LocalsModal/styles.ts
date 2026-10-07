import styled from "styled-components";
import { LocalsContainerProps } from "./types";
import { theme_colors } from "../../../../theme/theme";

export const LocalsContainer = styled.div<LocalsContainerProps>`
  display: flex;
  align-items: center;
  padding: 10px;
  border: ${({ isDefault }) =>
    isDefault ? `1px solid ${theme_colors.green}` : "0px solid #d8d8d8"};
  border-radius: 9.12px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0px;
  }

  &:hover {
    background-color: ${({ isDefault }) =>
      isDefault ? theme_colors.white : theme_colors.light_gray};
    transition: 0.3s;
  }
`;

export const ScrollContainer = styled.div`
  padding: 10px;
  max-height: 210px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;
