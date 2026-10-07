import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { MotiView } from "moti";

export const Container = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const Dot = styled(MotiView)`
  width: ${RFValue(15)}px;
  height: ${RFValue(15)}px;
  border-radius: ${RFValue(360)}px;
  background-color: ${({theme}) => theme.colors.primary};
  margin: 15px;
`;