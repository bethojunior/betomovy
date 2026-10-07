import styled from 'styled-components/native';

export const Modall = styled.View`
  background-color: #fff;
  width: 95%;
  padding: 15px;
  align-self: center;
  align-content: center;
  border-radius: 8px;
  elevation: 30;
  top: 10%;
`;

export const TitleResume = styled.Text`
  font-size: 15px;
  font-family: MavenPro_600SemiBold;
  margin-top: 15px;
  text-transform: capitalize;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Info = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 17px;
  max-width: 95%;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextButton = styled.Text`
  font-size: 17px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const Container = styled.View`
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const GroupDetails = styled.View`
  width: 50%;
`;

export const Title = styled.Text`
  font-size: 17px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 40px;
  margin-top: 20px;
`;

export const AnimationContainer = styled.View`
  justify-content: center;
  align-items: center;
`;
