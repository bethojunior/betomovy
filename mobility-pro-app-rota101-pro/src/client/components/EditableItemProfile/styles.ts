import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.border_white_light};
`;

export const ContentText = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const TextGroup = styled.View`
  flex: 1;
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  max-width: 55%;
`;

export const LabelValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-right: ${({theme}) => theme.spacing.small}px;
`;

export const EditingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
}))`
  flex: 1;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding-vertical: ${({theme}) => theme.spacing.small}px;
  padding-horizontal: ${({theme}) => theme.spacing.medium}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const IconButton = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  align-items: center;
  justify-content: center;
`;

export const ErrorText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.red};
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const SecondaryActionButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const SecondaryActionText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.primary};
`;
