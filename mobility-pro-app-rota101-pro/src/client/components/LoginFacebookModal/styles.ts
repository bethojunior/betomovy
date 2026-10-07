import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_black_opacity};
  justify-content: center;
  align-items: center;
`;

export const Content = styled.View`
  height: 60%;
  width: 90%;
  border-radius: ${RFValue(10)}px;
  margin-top: ${RFValue(10)}px;
  justify-content: center;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: ${RFValue(30)}px;
  padding-bottom: ${RFValue(45)}px;
`;

export const ContentExit = styled.TouchableOpacity`
  position: absolute;
  top: ${RFValue(40)}px;
  right: ${RFValue(40)}px;
  padding: ${RFValue(4)}px;
  border-radius: ${RFValue(10)}px;
  z-index: 1;
`;
