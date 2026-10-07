import styled from "styled-components/native";
import {RFValue} from 'react-native-responsive-fontsize';

interface ElementsDynamicsProps {
    colorText?: string;
    backgroundColor?: string;
}

export const Container = styled.View``

export const Header = styled.View<ElementsDynamicsProps>`
    width: 100%;
    height: 100px;
    padding: 0 10px;
    background-color: ${props => props.backgroundColor};
    flex-direction: row;
    align-items: center;
`

export const TitleHeader = styled.Text<ElementsDynamicsProps>`
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.colorText};
`

export const ButtonBack = styled.TouchableOpacity``

export const Body = styled.View`
    justify-content: center;
    margin: 5px 10px;
    position: relative;
`

export const ContentBalance = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
`
export const TextBalance = styled.Text`
    font-size: 18px;
    text-align: center;
`

export const ValueBalance = styled.Text`
    font-size: 22px;
    font-weight: bold;
    text-align: center;
`

export const ContentLatestTransactions = styled.ScrollView`
    margin-top: 10px;
    width: 100%;
    height: ${RFValue(500)}px;
    background-color: ${({theme}) => theme.colors.background_white};
    padding: 10px 15px;
    elevation: 5;   
`

export const TitleTransactions = styled.Text`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`

export const ButtonAction = styled.TouchableOpacity<ElementsDynamicsProps>`
    background-color: ${props => props.backgroundColor};
    padding: 10px 20px;
    border-radius: 5px;
`

export const TextButtonAction = styled.Text<ElementsDynamicsProps>`
    font-size: 18px;
    color: ${props => props.colorText};
`

export const TextTransaction = styled.Text`
    font-size: 30px;
    font-weight: bold;
    text-align: center;
`

export const ContentFooter = styled.View`
    width: 100%;
    bottom: ${RFValue(-45)}px;
    flex-direction: row;
    position: absolute;
`