import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

interface ColorProps {
  color?: string;
}

export const ContainerText = styled.View`
  margin-top: 5px;
`;

export const ContainerModal = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
  flex: 1;
  padding: ${({theme}) => theme.spacing.xlarge}px
    ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderCard = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const TextTitle = styled.Text`
  color: ${({theme}) => theme.colors.black};
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;

export const DateCard = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
export const Subtitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing.small}px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
export const TextSmall = styled.Text<ColorProps>`
  color: ${({color, theme}) => color || theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;

export const Content = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
  flex-direction: column;
`;

export const ContainerAddress = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContainerFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const TextBold = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonsHelp = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerDialog = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  padding: 10px 0;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const HeaderCardContainer = styled.View`
  flex-direction: row;
  padding: 10px 0;
  align-items: center;
  border-bottom-width: 0.1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const ContainerMoviment = styled.View`
  align-items: flex-start;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const Text = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerGraphic = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-bottom: ${({theme}) => theme.spacing.xslarge}px;
`;

export const Chart = styled.View`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
  justify-content: center;
`;

export const ContainerValue = styled.View`
  margin-left: ${({theme}) => theme.spacing.medium}px;
  flex-direction: column;
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;
export const Value = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
`;

export const ContainerCard = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
`;

export const TextSize = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => shade(0.5, theme.colors.background_global)};
`;

export const ContainerInfo = styled.View`
  flex-direction: column;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerViewScroller = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContainerPicker = styled.View``;

export const styleSelect = StyleSheet.create({
  inputIOS: {
    fontSize: 13,
    marginLeft: 10,
    paddingBottom: 5,
    color: themeCss.colors.secondary,
  },
  inputAndroid: {
    fontSize: 13,
    marginLeft: 10,
    color: themeCss.colors.secondary,
    paddingBottom: 1,
  },
});
