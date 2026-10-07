import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  height: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({theme}) => theme.spacing.large}px
    ${({theme}) => theme.spacing.medium}px;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.xxlarge}px;
  font-weight: bold;
`;

export const ContainerContent = styled.ScrollView`
  margin: ${({theme}) => theme.spacing.large}px auto;
  height: 100%;
  width: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const ContainerFooter = styled.View`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
