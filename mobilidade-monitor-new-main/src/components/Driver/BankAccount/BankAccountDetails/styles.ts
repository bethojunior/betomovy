import styled from "styled-components";

import { theme_colors } from "../../../../theme/theme";
import { ColumnsProps, SpanProps } from "./types";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${theme_colors.black};
`;

// Conta bancária ocupa mais espaço que o Pix; em tela estreita empilha
export const Sections = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid ${theme_colors.light_gray};
  border-radius: 10px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${theme_colors.light_gray};
  font-size: 13px;
  font-weight: 700;
  color: ${theme_colors.black};
`;

export const Fields = styled.div<ColumnsProps>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 14px 16px;
`;

export const Field = styled.div<SpanProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  grid-column: span ${({ $span }) => $span ?? 1};
`;

export const FieldIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: ${theme_colors.black};
`;

export const FieldText = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-size: 11px;
  color: ${theme_colors.gray};
`;

export const FieldValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme_colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PixIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const EmptyText = styled.span`
  font-size: 13px;
  color: ${theme_colors.gray};
`;
