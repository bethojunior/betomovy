import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #00000070;
  z-index: 500;
`;

export const ContentModal = styled.View`
  width: ${RFValue(300)}px;
  height: ${RFValue(300)}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(5)}px;
  background-color: ${({theme}) => theme.colors.background_white};
  padding: ${RFValue(5)}px;
  border-radius: ${RFValue(5)}px;
`;

export const ContentIcon = styled.View`
  margin: ${RFValue(10)}px 0;
  text-align: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  margin: ${RFValue(10)}px 0;
  text-align: center;
  font-weight: bold;
`;

export const Body = styled.Text`
  font-size: ${RFValue(12)}px;
  margin: ${RFValue(10)}px 0;
  text-align: center;
  font-style: italic;
`;

export const ContentButtonCloseModal = styled.View`
  margin: ${RFValue(10)}px 0;
`;

export const ButtonCloseModal = styled.TouchableOpacity`
  padding: ${RFValue(6)}px ${RFValue(20)}px;
  border-radius: ${RFValue(3)}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const TextButtonCloseModal = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.primaryText};
`;
