import styled from 'styled-components/native';

export const AlertContent = styled.View`
  background-color: #e31818;
  width: 97%;
  align-self: center;
  position: absolute;
  top: -110px;
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  padding: 10px;
  justify-content: space-between;
`;

export const TitleAlert = styled.Text`
  font-family: MavenPro_600SemiBold;
  color: #fffafa;
`;

export const TextAlert = styled.Text`
  font-family: MavenPro_400Regular;
  color: #fffafa;
  text-align: justify;
`;

export const RecContent = styled.View`
  background-color: #fffafa;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
`;

export const TextRec = styled.Text`
  color: #e31818;
  font-family: MavenPro_600SemiBold;
`;

export const BallRec = styled.View`
  width: 10px;
  height: 10px;
  background-color: #e31818;
  border-radius: 50px;
`;
