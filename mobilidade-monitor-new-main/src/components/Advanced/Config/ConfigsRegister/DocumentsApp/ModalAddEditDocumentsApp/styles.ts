import styled from "styled-components";
import { theme_colors } from "../../../../../../theme/theme";

export const Container = styled.form``;

export const ContentInput = styled.div`
  margin: 0.5rem 0;
`;

export const MessageError = styled.span`
  display: block;
  margin: 0.5rem 0;
  color: ${theme_colors.red_crismon};
`;

export const Label = styled.label`
  display: block;
  margin: 0.5rem 0;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin: 1rem 0;
`;
