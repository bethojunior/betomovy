import styled from "styled-components/native";

interface HeaderMenuProps{
    color: string;
}

export const Container = styled.View`
    position: relative;
    flex-direction: column;
`

export const ButtonBack = styled.TouchableOpacity`
    width: 50px;
    margin: 0 20px;
    position: relative;
`

export const HeaderMenu = styled.View<HeaderMenuProps>`
    justify-content: center;
    background-color: ${props => props.color};
    width: 100%;
    height: 150px;
`

export const ContentUser = styled.View``

export const BodyMenu = styled.View`
    height: 100%;
    padding: 20px;
`

export const ItemMenu = styled.TouchableOpacity`
    margin: 10px 0;
`

export const TextMenu = styled.Text<{ color: string }>`
    font-size: 22px;
    color: ${props => props.color};
`