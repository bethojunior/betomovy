import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;
export const TitlePage = styled.Text`
  padding: 10;
  background-color: shade(0.05, ${({theme}) => theme.colors.background_global});
  text-align: 'center';
  font-size: 14;
`;
