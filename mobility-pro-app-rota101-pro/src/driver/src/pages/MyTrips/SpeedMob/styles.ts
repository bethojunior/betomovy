import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    position: relative;
`

export const Header = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.backgroundColor};
    padding: 0 10px;
`

export const ButtonBack = styled.TouchableOpacity``

export const TitleHeader = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.colorText};
    flex: 1;
`

export const ContentTrips = styled.ScrollView`
    padding: 0 10px;
`

export const TextNone = styled.Text`
  text-align: center;
  color: red;
`;