import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const AlertContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

export const AnimationContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-bottom: 12px;
`;

export const SubTitle = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  line-height: 20px;
`;

export const PermissionsList = styled.View`
  width: 100%;
  padding: 0 10px;
`;

export const PermissionItem = styled.View`
  padding: 8px 0;
`;

export const ButtonsContainer = styled.View`
  width: 100%;
  margin-top: 20px;
`;

export const AlertButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 14px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const SuccessText = styled.Text`
  font-size: 14px;
  color: #4CAF50;
  text-align: center;
  font-weight: bold;
`;

export const PermissionText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText || theme.colors.white};
  font-size: 16px;
  font-weight: bold;
`;
