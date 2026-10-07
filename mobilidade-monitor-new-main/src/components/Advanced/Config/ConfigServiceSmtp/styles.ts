import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";

export const Container = styled.form`
  height: auto;
  max-height: 400px;
  overflow: auto;
  padding: 0 0.5rem;

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

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const ContentMsgError = styled.div`
  color: ${theme_colors.red_crismon};
  font-size: 12px;
  margin-top: 0.3rem;
`;

export const Label = styled.label``;

export const Footer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;
