import styled from 'styled-components/native';

export const Button = styled.TouchableOpacity`
  width: 100%;
  padding: ${({theme}) => theme.spacing.xlarge}px 0;
  background-color: ${({theme}) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: 30px;
  font-weight: bold;
`;
