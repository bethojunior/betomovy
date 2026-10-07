import styled from "styled-components/native";

export const Container = styled.View``

export const Content = styled.View``

export const Header = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    background-color: ${props => props.backgroundColor};
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
`

export const Body = styled.View`
    align-items: center;
    justify-content: center;
    padding: 0 20px;
`

export const ButtonBack = styled.TouchableOpacity``

export const TitleHeader = styled.Text<{ colorText: string }>`
    flex: 1;
    font-size: 20px;
    text-align: center;
    color: ${props => props.colorText};
`

export const ButtonAddDriver = styled.TouchableOpacity<{ backgroundColor: string }>`
    background-color: ${props => props.backgroundColor};
    padding: 10px 20px;
    border-radius: 8px;
`

export const TextButtonAddDriver = styled.Text<{ textColor: string }>`
    color: ${props => props.textColor};
    font-size: 18px;
`

export const ContentListDrivers = styled.ScrollView``

export const Message = styled.Text`
    font-size: 18px;
`

export const TextTitle = styled.Text``
