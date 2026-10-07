import Animated from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const BackGroundModal = styled(Animated.View)`
  flex-direction: row;
`;

export const EmptySpace = styled.View`
  height: 100%;
  width: 30%;
`;

export const ContainerModal = styled.View`
  width: 70%;
`;

export const ProfileButton = styled.TouchableOpacity`
  flex-direction: row;
`;

export const PerfilContainer = styled.View`
  margin: -10px -5px 0 -5px;
  padding: 10px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const EditProfileContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;

export const CloseModalButton = styled.TouchableOpacity`
  height: 50px;
  width: 30px;
  align-items: center;
  justify-content: center;
`;

export const TextProfile = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
`;

export const NameContainer = styled.View`
  margin-left: 10px;
  max-width: 70%;
`;

export const CarDetails = styled.View`
  margin-top: ${RFValue(10)}px;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: 10px;
  border-radius: 18px;
`;

export const DriverCodeContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 0.5px;
  border-bottom-color: #797979d6;
  margin-bottom: 5px;
  padding-bottom: 5px;
`;

export const TitleDetails = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextData = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const Container = styled.View`
  height: 100%;
  padding: 10px 5px 0 5px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.ScrollView`
  margin-top: 20px;
`;

export const VersionNumber = styled.TouchableOpacity`
  align-self: center;
  padding-bottom: 10px;
`;

export const VersionNumberText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 12px;
  align-self: center;
`;

export const HeaderMenu = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-left: 5px;
`;

export const ContentModal = styled.View``;
export const Card = styled.View`
  margin: ${({theme}) => theme.spacing.large}px 0;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
  margin-left: 15px;
`;

export const IconContent = styled.View`
  height: 25px;
  max-height: 25px;
  width: 25px;
  max-width: 25px;
  align-items: center;
  justify-content: center;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  font-size: 16px;
  margin-bottom: 13px;
`;

export const HeaderContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  flex-direction: row;
  padding: 13px 15px;
  align-items: center;
`;

export const TitleAcordion = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  margin-left: 60px;
`;
