import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

export const ContainerCamera = styled.View`
  margin-top: 20px;
  flex: 1;
`;

export const ButtonSend = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;
