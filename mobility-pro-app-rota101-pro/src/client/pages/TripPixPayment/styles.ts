import styled from 'styled-components/native';
import { Card } from '~/components/ui/Card';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';
import { readableTextColor } from '~/utils/color';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_white};
`;

export const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
})``;

export const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ErrorTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-top: 8px;
  margin-bottom: 6px;
`;

export const ErrorMessage = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  margin-bottom: 30px;
`;

export const InstructionsCard = styled(Card)`
  width: 100%;
  padding: 20px 20px 4px 20px;
  border-radius: 10px;
`;

export const InstructionsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const InstructionsTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const InstructionsBody = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const InstructionStepsColumn = styled.View`
  flex: 1;
`;

export const InstructionsIllustration = styled.Image`
  width: 70px;
  height: 104px;
  margin-bottom: 16px;
`;

export const InstructionStepRow = styled.View`
  flex-direction: row;
`;

export const InstructionStepBadgeColumn = styled.View`
  align-items: center;
  width: 24px;
`;

export const InstructionStepBadge = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const InstructionStepBadgeText = styled.Text`
  color: ${({ theme }) => readableTextColor(theme.colors.primary)};
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: bold;
`;

export const InstructionStepConnector = styled.View`
  flex: 1;
  min-height: 12px;
  width: 1px;
  margin-vertical: 4px;
  border-left-width: 1px;
  border-color: ${({ theme }) => theme.colors.grayBright};
  border-style: dashed;
`;

export const InstructionStepContent = styled.View`
  flex: 1;
  padding-left: 12px;
  padding-bottom: 16px;
`;

export const InstructionStepText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  line-height: 18px;
`;

export const SecurityCard = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.background_white_light};
  margin-top: 16px;
`;

export const SecurityIconBadge = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary}1A;
`;

export const SecurityTextContainer = styled.View`
  flex: 1;
`;

export const SecurityTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2px;
`;

export const SecuritySubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  line-height: 16px;
`;

export const NotificationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

export const NotificationText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;
