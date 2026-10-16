import {Platform} from 'react-native';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const HeaderSchedule = styled.View`
  width: 100%;
  text-align: right;
  padding: ${Platform.OS === 'ios' ? theme.spacing.large : 0}px
    ${theme.spacing.large}px;
  margin-top: ${theme.spacing.xslarge}px;
  background-color: ${theme.colors.white};
`;

export const SchedulerContainer = styled.View`
  padding: 10px;
`;

export const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
`;

export const DateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-right-width: 1px;
  border-right-color: ${({theme}) => theme.colors.border};
  width: 100%;
  padding: ${({theme}) => theme.spacing.small}px;
  justify-content: space-between;
`;

export const InputLabel = styled.Text`
  font-size: 15px;
  padding: 8px 4px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextValue = styled.Text`
  font-size: 13px;
  padding: 8px 4px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const HourContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  margin-top: 10px;
`;

export const HourButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-right-width: 1px;
  border-right-color: ${({theme}) => theme.colors.border};
  width: 100%;
  padding: ${({theme}) => theme.spacing.small}px;
  justify-content: space-between;
`;
