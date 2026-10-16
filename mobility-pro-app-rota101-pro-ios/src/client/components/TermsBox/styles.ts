import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  border: 1px solid #000000;
  border-radius: 5px;
  margin: 20px 0;
`;

export const TextTerms = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  line-height: ${RFValue(20)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const CustomScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 10,
  },
})``;
