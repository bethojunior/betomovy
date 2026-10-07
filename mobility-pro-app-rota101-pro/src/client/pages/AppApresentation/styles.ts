import styled from "styled-components/native";
import { MotiImage , MotiView} from "moti";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.colors.background_global};
    align-items: center;
    justify-content: center;
`

export const TitleApresentation = styled.Text<{color: string}>`
    font-size: ${({color}) => color ? RFValue(15):  RFValue(30)}px;
    font-weight: bold;
    color: ${({theme,color}) => color ? 'red' : theme.colors.primary };
    margin: ${RFValue(10)}px;
`

export const DescriptionApresentation = styled.Text`
    font-size: ${RFValue(30)}px;
`

export const ImageAnimated = styled(MotiImage)`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
`;

export const ContentDotsLoading = styled.View`
    flex-direction: row;
    margin: ${RFValue(15)}px;
`

export const Bar = styled(MotiView)`
  width: ${RFValue(15)}px;
  height: ${RFValue(15)}px;
  border-radius: ${RFValue(360)}px;
  background-color: ${({theme}) => theme.colors.primary};
  margin: 15px;
`;