import styled from "styled-components";

import { theme_colors } from "../../../../theme/theme";

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: ${theme_colors.black};
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  column-gap: 12px;
`;

export const PixIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const Hint = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  color: ${theme_colors.gray};
`;
