import styled from 'styled-components/native';
import { rgba, shade } from 'polished';
import Feather from '@expo/vector-icons/Feather';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';
import { Card } from '../ui/Card';

export const Container = styled(Card)`
  border-radius: 10px;
  padding: 20px 20px;
  margin-bottom: 20px;
  gap: 12px;
`;

export const Header = styled.View`
  align-items: center;
  gap: 12px;
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  line-height: 18px;
`;

export const Divider = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
  margin-vertical: 4px;
`;

export const FieldLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
`;

export const FieldContainer = styled.View`
  flex-direction: column;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.1)};
  padding: 8px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) =>
    USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : theme.colors.primary};
`;

export const FieldValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) =>
    USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : shade(0.3, theme.colors.primary)};
`;

export const CopyButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 16px 10px;
  width: 100%;
  gap: 8px;
`;

export const CopyButtonText = styled.Text`
  color: ${USE_DARK_PRIMARY_VARIANT ? 'black' : 'white'};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
`;

export const CopyButtonIcon = styled(Feather)`
  color: ${USE_DARK_PRIMARY_VARIANT ? 'black' : 'white'};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
`;
