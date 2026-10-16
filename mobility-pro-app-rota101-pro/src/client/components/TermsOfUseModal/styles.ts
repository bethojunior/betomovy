import styled from 'styled-components/native';

interface SimpleTextProps {
  colorText?: string;
}

export const Content = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_black_light};
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: 10px;
  height: 90%;
  display: flex;
  justify-content: center;
  width: 90%;
  align-self: center;
`;

export const Button = styled.TouchableOpacity`
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 30%;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  align-self: flex-end;
`;

export const SimpleText = styled.Text<SimpleTextProps>`
  color: ${props => props.colorText ? props.colorText : ({ theme }) => theme.colors.secondary};
`;
