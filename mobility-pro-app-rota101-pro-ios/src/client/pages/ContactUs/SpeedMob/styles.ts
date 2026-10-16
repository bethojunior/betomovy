import styled from "styled-components/native";

export const Container = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
`

export const ButtonBack = styled.TouchableOpacity`
    position: absolute;
    top: 0;
    left: 0;
    margin: 15px;
`

export const Logo = styled.Image`
    width: 150px;
    height: 150px;
`

export const TitlePage = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    margin: 15px 0;
    color: ${props => props.colorText};
    text-align: center;
`

export const TextArea = styled.TextInput.attrs({
  multiline: true,
  textAlignVertical: 'top',
})`
  height: 300px;
  background-color: ${({theme}) => theme.colors.border_white_light};
  border-radius: 10px;
  text-align: justify;
  border: 0.5px solid #000000;
  padding: 12px;
`;

export const ButtonSend = styled.TouchableOpacity<{ colorButton: string }>`
    margin: 10px 0;
    padding: 10px 20px;
    background-color: ${props => props.colorButton};
    border-radius: 5px;
`

export const TextButtonSend = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.colorText}
`