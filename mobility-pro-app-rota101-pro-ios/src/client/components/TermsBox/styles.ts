import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";


export const Container = styled.View`
    border: 1px solid #000000;
    border-radius: 5px;
    height: ${RFValue(150)}px;
    padding: 10px;
    margin: 20px 0;
`

export const TextTerms = styled.Text`
    font-size: ${RFValue(13)}px;
`