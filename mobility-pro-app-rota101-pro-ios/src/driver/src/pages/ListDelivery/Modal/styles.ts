import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // Mantém o fundo semi-transparente
`;

export const ModalContent = styled.View`
  width: 90%;
  max-height: 80%;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: 20px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 3;
`;

export const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 10px;
  border-radius: 20px;
  background-color: ${({theme}) => theme.colors.primary};
  margin-bottom: 10px;
`;

export const ProfileImage = styled.ImageBackground`
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
`;

export const CompanyName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 10px;
`;

export const OrderCode = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 10px;
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: 5px;
`;

export const ItemText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.secondary};
`;
