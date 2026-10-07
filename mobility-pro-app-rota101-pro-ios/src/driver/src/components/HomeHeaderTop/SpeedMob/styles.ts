import styled from "styled-components/native";

export const Container = styled.View`
    position: absolute;
    top: 0;
    width: 100%;
    height: 80px;
    background-color: ${({theme}) => theme.colors.background_white};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    elevation: 5;
`

export const Button = styled.TouchableOpacity``

export const Logo = styled.Image`
    width: 60px;
    height: 60px;
`