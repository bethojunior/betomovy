import styled from 'styled-components/native';

export const Container = styled.View`
  align-self: flex-start;
  flex-direction: row;
  gap: ${({theme}) => theme.spacing.small}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const StarImg = styled.Image`
  width: 40px;
  height: 40px;
`;
