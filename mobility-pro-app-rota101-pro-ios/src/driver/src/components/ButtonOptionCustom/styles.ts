import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 15px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  margin: 0 15px;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const SubTitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const IconContent = styled.View``;
