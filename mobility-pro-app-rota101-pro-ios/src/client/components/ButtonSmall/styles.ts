import styled from 'styled-components/native';

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.large}px 0;
  border-radius: 5px;
  flex: 1;
  justify-content: center;
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  text-align: center;
  font-size: 20px;
`;

export const OptionalButton = styled.TouchableOpacity`
  margin-right: 5px;
  background-color: ${({theme}) => theme.colors.grayLight};
  border-radius: 5px;
  max-width: 18%;
  padding: 10px 0;
  flex: 1;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;
