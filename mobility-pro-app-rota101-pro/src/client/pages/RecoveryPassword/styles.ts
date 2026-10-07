import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';
import theme from '../../styles/theme';

interface ButtonPressProps {
  enabled?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  height: 80%;
  justify-content: center;
  align-items: center;
`;

export const Section = styled.View`
  width: 90%;
  align-items: center;
`;

export const Logo = styled.Image`
  width: ${RFValue(145)}px;
  height: ${RFValue(145)}px;
`;

export const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.View``;

export const ModalText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const EmailText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const SectionButtonModal = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${RFValue(30)}px;
`;

export const ButtonPress = styled.Pressable<ButtonPressProps>`
  border-radius: 5px;
  padding: 10px;
  width: 40%;
  background-color: ${({enabled, theme}) =>
    enabled ? theme.colors.primary : shade(0.25, theme.colors.primary)};
`;

export const TextButtonPress = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.white};
  text-align: center;
`;

export const ButtonModal = styled.TouchableOpacity`
  background: ${({theme}) => theme.colors.primary};
  padding: 10px;
  border-radius: 5px;
  width: 80%;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const Error = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.toast.attention};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-top: ${RFValue(4)}px;
`;

export const styles = StyleSheet.create({
  modalView: {
    backgroundColor: themeCss.colors.white,
    textAlign: 'center',
    width: '90%',
    borderRadius: 5,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(20),
    alignItems: 'center',
    shadowColor: themeCss.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: theme.colors.black,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: theme.colors.black,
  },
});
