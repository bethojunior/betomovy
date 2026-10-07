import styled from "styled-components";
import { Button } from "antd";
import { theme_colors } from "../../../theme/theme";

export const LabelText = styled.span`
  font-size: 14px;
  color: #000000;
  font-weight: bold;
`;

export const Text = styled.span`
  font-size: 14px;
  color: #000000;
`;

interface StatusBadgeProps {
  $backgroundColor: string;
  $textColor: string;
}

export const StatusBadge = styled(Text)<StatusBadgeProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  border-radius: 8px;
  padding: 1px 4px;
  font-size: 12px;
  line-height: 1;
  display: inline-block;
  width: fit-content;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 1300px;
  align-self: center;
  position: relative;
  background-color: ${theme_colors.white};
  border: 1px solid #eef0f2;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.06);
  margin: 0.5rem 0;
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem 0.75rem;
  flex-wrap: wrap;
`;

export const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.02em;
`;

export const SettingsButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #000000;
  border-color: #000000;
`;

export const TopRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem;
  align-items: stretch;
  flex-wrap: wrap;

  @media (max-width: 900px) {
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
  min-width: 200px;
  padding: 1rem;
  background-color: ${theme_colors.white};
  border-radius: 12px;
  border: 1px solid #eef0f2;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000000;
  font-size: 15px;
  font-weight: 700;
`;

export const SectionFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 1rem;
  min-width: 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
`;

export const FieldIcon = styled.span`
  color: #000000;
  margin-top: 2px;
  display: flex;
  flex-shrink: 0;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-size: 12px;
  color: #000000;
  font-weight: 700;
  overflow-wrap: break-word;
`;

export const FieldValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  overflow-wrap: break-word;
  word-break: break-word;
`;
