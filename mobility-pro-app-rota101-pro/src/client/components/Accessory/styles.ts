import {shade} from 'polished';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(TouchableOpacity)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  margin-bottom: 8px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;

  margin-left: ${RFValue(8)}px;
  margin-right: ${RFValue(8)}px;
`;
