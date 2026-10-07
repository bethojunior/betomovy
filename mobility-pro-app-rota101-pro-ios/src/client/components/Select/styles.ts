import styled from "styled-components/native";

export const Container = styled.View`
    width: 100%;
    margin: 5px 0;
`
export const Content = styled.View`
    width: 100%;
    border: 1px solid ${({theme}) => theme.colors.black};
    margin: 10px 0;
`

export const LabelSelect = styled.Text`
    font-size: 16px;
`