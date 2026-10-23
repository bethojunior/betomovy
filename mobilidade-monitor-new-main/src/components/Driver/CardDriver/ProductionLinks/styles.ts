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
  gap: 0.75rem;
`;

export const ProductionIconCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  min-width: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background-color: #f1f5f9;
  color: #0284c7;
  transition: all 0.2s ease;
`;

export const ProductionChevron = styled.span`
  color: #94a3b8;
  display: flex;
  flex-shrink: 0;
  transition: all 0.2s ease;
`;

export const ProductionTileText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.35;
  overflow-wrap: break-word;
`;

export const ProductionTile = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: ${theme_colors.white};
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  transition: all 0.2s ease;

  &:hover {
    border-color: #0284c7;
    background-color: #f0f9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(2, 132, 199, 0.1);

    ${ProductionIconCircle} {
      background-color: #0284c7;
      color: #ffffff;
    }

    ${ProductionChevron} {
      color: #0284c7;
      transform: translateX(3px);
    }
  }
`;
