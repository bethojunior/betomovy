import styled from "styled-components/native";

interface HeaderProps{
    backgroundColor?: string;
}

export const Container = styled.View``

export const Header = styled.View<HeaderProps>`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.backgroundColor};
    height: 100px;
    padding: 0 10px;
`

export const Body = styled.View`
    padding: 10px 0;
`

export const ButtonBack = styled.TouchableOpacity``

export const TitleHeader = styled.Text<{ colorText: string }>`
    font-size: 25px;
    text-align: center;
    flex: 1;
    color: ${props => props.colorText};
`

export const ContentNotifications = styled.ScrollView`
    padding: 10px 20px;
    height: 100%;
`

export const ContentCard = styled.View`
    margin: 10px 0;
`

export const TitleCard = styled.Text<{ isMarked: "0" | "1" }>`
    font-size: 18px;
    font-weight: bold;
    text-decoration: ${props => props.isMarked === '1' ? 'line-through' : 'none'};
`

export const MessageCard = styled.Text`
    font-size: 14px;
`

export const ContentButtonCard = styled.View`
    flex-direction: row;
`

export const ButtonCard = styled.TouchableOpacity<{ colorButton }>`
    background-color: ${props => props.colorButton};
    padding: 5px 10px;
    font-size: 16px;
    border-radius: 5px;
    margin-top: 5px;
    margin-right: 10px;
`

export const TextButtonCard = styled.Text<{ colorText: string }>`
    color: ${props => props.colorText};
`

export const MessageNotFound = styled.Text`
    font-size: 25px;
    text-align: center;
`