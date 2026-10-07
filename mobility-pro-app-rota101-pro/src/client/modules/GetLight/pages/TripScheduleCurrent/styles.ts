import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const MapContainer = styled.View`
  flex: 1;
`;

export const HeaderContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;

export const ContainerInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${({theme}) => theme.spacing.large}px;
  align-items: center;
  width: 100%;
`;

export const ContainerContent = styled.View`
  flex-direction: column;
  justify-content: space-between;
  margin-left: ${({theme}) => theme.spacing.large}px;
`;

export const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const StatusInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ContainerActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StatusInfoText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;
export const Star = styled.Text`
  margin-left: auto;
`;
export const SubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;
