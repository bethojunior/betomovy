import styled from 'styled-components/native';

export const Content = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-size: 17px;
  margin-bottom: 10px;
`;

export const Input = styled.TextInput`
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  padding: 3px 10px;
`;

export const SimpleText = styled.Text`
  margin-top: 10px;
  color: ${({theme}) => theme.colors.secondary};
`;
