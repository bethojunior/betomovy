import styled from 'styled-components/native';

export const AlertContent = styled.View`
  background-color: #dc2626;
  width: 96%;
  align-self: center;
  position: absolute;
  top: -115px;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  padding: 12px 14px;
  justify-content: space-between;
  elevation: 6;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);
`;

export const TitleAlert = styled.Text`
  font-family: MavenPro_700Bold;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

export const TextAlert = styled.Text`
  font-family: MavenPro_500Medium;
  color: rgba(255, 255, 255, 0.95);
  font-size: 11px;
  line-height: 15px;
`;

export const RecContent = styled.View`
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
`;

export const TextRec = styled.Text`
  color: #dc2626;
  font-family: MavenPro_700Bold;
  font-size: 10px;
  margin-top: 2px;
`;

export const BallRec = styled.View`
  width: 8px;
  height: 8px;
  background-color: #dc2626;
  border-radius: 4px;
`;
