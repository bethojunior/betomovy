import styled from "styled-components";
import { theme_colors } from "../../../theme/theme";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const ContentTable = styled.div`
  width: 100%;
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
  gap: 1rem;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

export const UserCell = styled.p`
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  margin: 0;
  font-weight: 500;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    opacity: 0.7;
  }
`;