import styled from 'styled-components/native';
import { Card } from '../ui/Card';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';

export const ContainerValue = styled(Card)`
  flex-direction: row;
  padding: 16px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
`;

export const InfoContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

export const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const Value = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) =>
    USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : theme.colors.primary};
`;

export const Divider = styled.View`
  margin-horizontal: 20px;
  border-left-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: solid;
  margin-vertical: 4px;
`;
