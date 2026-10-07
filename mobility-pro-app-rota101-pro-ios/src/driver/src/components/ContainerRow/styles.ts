import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  align-items: center;
`;

export const Content = styled.View`
  flex: 1;
  margin-left: ${({theme}) => theme.spacing.small}px;
`;
