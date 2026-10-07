import styled from "styled-components/native";

interface PointBadgeProps{
    color?: string;
}

export const Container = styled.View`
`

export const PointBadge = styled.View<PointBadgeProps>`
    width: 10px;
    height: 10px;
    border-radius: 360px;
    background-color: ${({theme}) => theme.colors.primary};
    position: absolute;
    right: 0;
    margin: 2px;
    z-index: 100;
`