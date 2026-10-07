import styled from 'styled-components/native';

export const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0px 20px 0px 20px;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const Content = styled.View`
  padding: 20px 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  height: 60%;
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.small}px;
  border-bottom-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-bottom-right-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerOffers = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerText = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
`;
