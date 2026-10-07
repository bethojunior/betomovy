import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
    flex: 1;
    position: relative;
`

export const Header = styled.View<{backgroundColor: string}>`
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
    background-color: ${props => props.backgroundColor};
`

export const TitleHeader = styled.Text<{colorText}>`
    flex: 1;
    text-align: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.colorText};
`

export const ButtonBack = styled.TouchableOpacity``

export const ContentTravels = styled.ScrollView`
    height: 100%;
    width: 100%;
    padding: 0 ${RFValue(10)}px;
`
