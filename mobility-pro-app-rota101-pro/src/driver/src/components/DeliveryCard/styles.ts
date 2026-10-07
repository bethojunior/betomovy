import styled from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-vertical: 8px;
  elevation: 2; // for Android shadow
  shadow-color: #000; // for iOS shadow
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

export const ImageContainer = styled.View`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: #eaeaea;
`;

export const Image = styled.ImageBackground`
  width: 100%;
  height: 100%;
`;

export const InfoContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

export const DeliveryId = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const DeliveryFee = styled.Text`
  font-size: 14px;
  color: #666;
`;

export const DeliveryTime = styled.Text`
  font-size: 14px;
  color: #666;
`;
