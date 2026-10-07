import styled from 'styled-components/native';

export const ContainerButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
  margin-left: ${({theme}) => theme.spacing.large}px;
  top: 20px;
  z-index: 1;
`;
