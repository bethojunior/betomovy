import styled from 'styled-components/native';

export const Photo = styled.Image`
  width: 25%;
  height: 70px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

export const Container = styled.View`
  margin-top: 20px;
  flex-direction: row;
`;

export const TitleInfo = styled.Text`
  margin-top: 5px;
  font-family: MavenPro_500Medium;
  font-size: 13px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ClientSection = styled.View`
  margin-left: 15px;
  margin-top: 5px;
  width: 75%;
`;

export const ButtonSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin-top: 5px;
`;

export const Info = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 15px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const NameClient = styled.Text`
  font-family: MavenPro_400Regular;
  margin-bottom: 5px;
  font-size: 16px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonCancel = styled.TouchableOpacity`
  padding: 6px;
  flex-direction: row;
  width: 46%;
  justify-content: space-between;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
  justify-content: center;
`;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-family: MavenPro_500Medium;
  font-size: 14px;
`;

export const ButtonMessage = styled.TouchableOpacity`
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colors.secondary};
  padding: 6px;
  flex-direction: row;
  width: 46%;
  justify-content: space-between;
  border-radius: 5px;
  justify-content: center;
`;

export const TextMessage = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  font-size: 13px;
`;

// MavenPro_400Regular,
// MavenPro_500Medium,
