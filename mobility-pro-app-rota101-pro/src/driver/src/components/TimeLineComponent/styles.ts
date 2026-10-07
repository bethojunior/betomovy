import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const TimelineContainer = styled.View`
  align-items: flex-start;
  padding: 10px;
`;

interface ActiveStep {
  isActive: boolean;
  passed: boolean;
}

export const Step = styled.View<ActiveStep>`
  width: 25px;
  height: 25px;
  border-radius: ${({isActive}) => (isActive ? '15px' : '15px')};
  background-color: ${({isActive, passed, theme}) =>
    isActive ? theme.colors.primary : passed ? '#fff' : '#ccc'};
  border-width: ${({passed}) => (passed ? '0.5px' : '0px')};
  justify-content: center;
  align-items: center;
`;

export const DetailsContainer = styled.View`
  flex: 1;
  margin-bottom: 20px;
`;

export const StepLabel = styled.Text`
  padding: 5px 10px;
  font-family: MavenPro_500Medium;
  font-size: ${RFValue(15)}px;
`;

export const StepDetails = styled.Text`
  color: #808080;
`;

export const Line = styled.View`
  width: 2px;
  height: 100%;
  background-color: #ccc;
  position: absolute;
  left: 11px;
  z-index: -1;
`;

export const StepContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;
