import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  height: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const ContainerContent = styled.ScrollView`
  margin: ${({theme}) => theme.spacing.large}px auto;
  height: 100%;
  width: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.white};
  width: 100%;
  border-radius: ${({theme}) => theme.spacing.small}px;
  padding: ${({theme}) => theme.spacing.large}px;
  margin: ${({theme}) => theme.spacing.large}px auto;
`;

export const Text = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  text-align: center;
`;

export const ContainerButton = styled.View`
  flex: 1;
  width: 100%;
`;

export const ContainerButtonRow = styled.View`
  width: 100%;
  margin-top: auto;
  flex-direction: row;
  justify-content: space-between;
`;

export const Description = styled.Text`
  margin-top: ${({theme}) => theme.spacing.large}px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 15px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  text-align: center;
`;

export const HeaderDialog = styled.View`
  align-items: flex-end;
`;

export const ContainerDialog = styled.View`
  width: 100%;
  height: 250px;
  margin: ${({theme}) => theme.spacing.xslarge}px 0;
  padding: 0 ${({theme}) => theme.spacing.xslarge}px;
`;

export const Content = styled.View`
  margin: ${({theme}) => theme.spacing.large}px 0;
`;

export const Image = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-top: ${({theme}) => theme.spacing.small}px;
`;
export const ContentCenter = styled.View`
  justify-content: center;
  align-items: center;
`;
