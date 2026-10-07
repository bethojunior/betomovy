import {shade} from 'polished';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(TouchableOpacity)`
  width: ${RFValue(71)}px;
  height: ${RFValue(62)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  padding: 3px;
  margin-bottom: 8px;
  border-radius: 8px;

  margin-left: ${RFValue(8)}px;
  margin-right: ${RFValue(8)}px;
`;
