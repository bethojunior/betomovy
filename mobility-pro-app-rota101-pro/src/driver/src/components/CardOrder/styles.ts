import styled from 'styled-components/native';

export const CardContainer = styled.View`
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
  background-color: white;
  shadow-color: #000;
  shadow-offset: 0 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
  elevation: 8;
`;

export const TouchFlex = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  font-family: MavenPro_600SemiBold;
`;

export const InfoTextButton = styled.Text`
  font-size: 16px;
  color: #333;
  margin-left: 10px;
  font-family: MavenPro_400Regular;
`;

export const ActionButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: #4caf50;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-top: 5px;
  margin-bottom: 10px;
  font-family: MavenPro_400Regular;
`;

export const ContainerEnd = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
