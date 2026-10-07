import styled from "styled-components";
import { theme_colors } from "../../../../../theme/theme";

export const Container = styled.div``;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const LabelInput = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

export const MessageError = styled.span`
  display: block;
  margin: 0.5rem 0;
  font-size: 14px;
  color: ${theme_colors.red_crismon};
`;