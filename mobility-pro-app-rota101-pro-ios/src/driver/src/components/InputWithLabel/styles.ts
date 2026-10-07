import styled from 'styled-components/native';

export const ContentInput = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const InputAddress = styled.TextInput`
  padding: ${({theme}) => theme.spacing.medium}px;
  width: 100%;

  border: 0.5px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;
