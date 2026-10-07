import styled from "styled-components/native";

export const Container = styled.View``

export const Header = styled.View<{ backgroundColor: string }>`
    background-color: ${props => props.backgroundColor};
    width: 100%;
    height: 100px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
`

export const ButtonBack = styled.TouchableOpacity``

export const Logo = styled.Image`
    width: 50px;
    height: 50px;
`

export const Body = styled.View``

export const ContentInformationDriver = styled.View<{ backgroundColor: string }>`
    align-items: center;
    padding: 5px 0;
    background-color: ${props => props.backgroundColor};
`

export const ImageDriver = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 360px;
    border-width: 2px;
    margin: 10px 0;
`

export const NameDriver = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.colorText};
`

export const Description = styled.Text<{ colorText: string }>`
    font-size: 18px;
    text-align: center;
    color: ${props => props.colorText};
`

export const ContentRow = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0;
`

export const NumberInformationDriver = styled.Text<{ colorText: string }>`
    font-size: 22px;
    text-align: center;
    color: ${props => props.colorText};
`

export const ContentOptions = styled.View`
    padding: 0 15px;
`

export const Item = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin: 20px 0;
`

export const ItemText= styled.Text`
    font-size: 20px;
    margin-left: 10px;
`