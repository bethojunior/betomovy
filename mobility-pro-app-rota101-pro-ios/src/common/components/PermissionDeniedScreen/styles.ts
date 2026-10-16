import styled from 'styled-components/native';

export const PermissionContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${({theme}) => theme.colors.white};
`;

export const PermissionTitle = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
  line-height: 26px;
`;

export const PermissionText = styled.Text`
  font-size: 15px;
  text-align: center;
  margin-bottom: 30px;
  color: ${({theme}) => theme.colors.text_gray};
  line-height: 22px;
`;

export const ButtonsContainer = styled.View`
  width: 100%;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding-horizontal: 40px;
  padding-vertical: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.background_white_light};
  padding-horizontal: 40px;
  padding-vertical: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text<{ primary?: boolean }>`
  color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.secondary};
  font-size: 16px;
  font-weight: 600;
`;

