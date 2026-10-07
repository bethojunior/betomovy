import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  padding-left: ${({theme}) => theme.spacing.xlarge}px;
  padding-right: ${({theme}) => theme.spacing.xlarge}px;
  padding-top: ${({theme}) => theme.spacing.medium}px;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const ContentButton = styled.View`
  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(23)}px;
`;

export const ContainerPhoto = styled.View`
  align-items: center;
  margin-top: ${RFValue(-20)}px;
`;

export const InputPhoto = styled.Image`
  align-items: center;
  margin-bottom: ${RFValue(10)}px;

  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: ${RFValue(50)}px;

  transform: scaleX(-1);
`;

export const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
  },
});
