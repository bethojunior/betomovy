import styled from "styled-components";
import { Button } from "antd";
import { theme_colors } from "../../../theme/theme";

export const LabelText = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 600;
`;

export const Text = styled.span`
  font-size: 13.5px;
  color: #0f172a;
`;

interface StatusBadgeProps {
  $backgroundColor: string;
  $textColor: string;
}

export const StatusBadge = styled(Text)<StatusBadgeProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.35px;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 1400px;
  align-self: center;
  position: relative;
  background-color: ${theme_colors.white};
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.02);
  margin: 0.85rem 0;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
    border-color: #cbd5e1;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
`;

export const HeaderTitle = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #0284c7;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 4px 14px;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
`;

export const SettingsButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  padding: 0 14px;
  height: 36px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    color: #0284c7;
    border-color: #0284c7;
    background-color: #f0f9ff;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(2, 132, 199, 0.15);
  }
`;

export const TopRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0.5rem;
  align-items: stretch;
  flex-wrap: wrap;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem 1.25rem;
`;

export const SectionCard = styled.div`
  flex: 1;
  min-width: 240px;
  padding: 1.15rem;
  background-color: ${theme_colors.white};
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
`;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 700;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;

  svg {
    color: #0284c7;
    flex-shrink: 0;
  }
`;

export const SectionFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.65rem 1rem;
  min-width: 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 3px 6px;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8fafc;
  }
`;

export const FieldIcon = styled.span`
  color: #0284c7;
  margin-top: 2px;
  display: flex;
  flex-shrink: 0;
  font-size: 15px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
`;

export const FieldLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FieldValue = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
