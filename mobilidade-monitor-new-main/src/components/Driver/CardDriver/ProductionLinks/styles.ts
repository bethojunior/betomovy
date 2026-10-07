import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";
import { SectionCard, SectionTitleRow } from "../styles";

export const ProductionCard = styled(SectionCard)`
  width: 100%;
`;

export { SectionTitleRow };

export const ProductionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.6rem;
`;

export const ProductionTile = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 0.9rem;
  border: 1px solid #eef0f2;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  background: ${theme_colors.white};
  cursor: pointer;
  font-family: inherit;
  text-align: left;

  &:hover {
    border-color: #000000;
    background-color: #f5f5f5;
  }
`;

export const ProductionIconCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #000000;
`;

export const ProductionTileText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
  overflow-wrap: break-word;
`;

export const ProductionChevron = styled.span`
  color: ${theme_colors.gray};
  display: flex;
  flex-shrink: 0;
`;
