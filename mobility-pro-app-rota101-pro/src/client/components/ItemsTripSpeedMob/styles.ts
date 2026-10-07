import styled from "styled-components/native";

import theme from "../../styles/theme";

export const Container = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin: 15px 0;
`

export const ContentIcon = styled.View`
    margin-right: 10px;
`

export const Text = styled.Text`
    font-size: 20px;
    color: ${theme.colors.primary}
`