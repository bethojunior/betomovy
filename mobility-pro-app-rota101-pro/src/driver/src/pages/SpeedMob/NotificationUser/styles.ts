import styled from "styled-components/native";

interface TextButtonNotifyProps{
    colorText: string; 
    viewed?: string;
}

export const Container = styled.View``

export const Header = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    background-color: ${props => props.backgroundColor};
`

export const TitleHeader = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    flex: 1;
    text-align: center;
    color: ${props => props.colorText};
`

export const ButtonBack = styled.TouchableOpacity``

export const Body = styled.View``

export const ContentNotifications = styled.ScrollView`
    padding: 10px;
    height: 88%;
`

export const ContentCard = styled.View`
    margin: 10px 0;
`

export const TitleNotify = styled.Text<{ viewed: string }>`
    font-size: 18px;
    font-weight: bold;
    text-decoration: ${props => props.viewed === '1'  ? 'line-through' : 'none'};
`

export const DescriptionNotify = styled.Text`
    font-size: 14px;
`

export const ContentButtonsNotify = styled.View`
    flex-direction: row;
    align-items: center;
`

export const ButtonNotify = styled.TouchableOpacity<{ backgroundColor: string}>`
    padding: 5px 10px;
    border-radius: 5px;
    margin-top: 5px;
    margin-right: 10px;
    background-color: ${props => props.backgroundColor};
    width: 150px;
`

export const TextButtonNotify = styled.Text<TextButtonNotifyProps>`
    color: ${props => props.viewed === '1' ? 'gray' : props.colorText};
    text-align: center;
`

export const MessageNotFound = styled.Text`
    font-size: 20px;
    text-align: center;
    font-weight: bold;
`