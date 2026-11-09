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
  padding: 16px 12px 18px 12px;
  background-color: ${({theme}) => theme.colors.brand_dark || '#0B1220'};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const EditProfileContainer = styled.View`
  flex-direction: row;
  padding: 6px 4px;
  justify-content: space-between;
  align-items: center;
`;

export const CloseModalButton = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
`;

export const TextProfile = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
`;

export const NameContainer = styled.View`
  margin-left: 10px;
  max-width: 70%;
`;

export const CarDetails = styled.View`
  margin-top: ${RFValue(12)}px;
  background-color: ${({theme}) => theme.colors.white};
  padding: ${RFValue(10)}px ${RFValue(14)}px;
  border-radius: 16px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

export const TitleDetails = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DriverCodeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  padding: ${RFValue(7)}px 0;
`;

export const InfoGrid = styled.View`
  flex-direction: row;
  padding: ${RFValue(7)}px 0;
`;

export const InfoCell = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
`;

export const InfoCellLabel = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.secondary};
  opacity: 0.6;
`;

export const InfoCellValue = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const VehicleInfoCell = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  overflow: hidden;
`;

export const VehicleInfoTextWrapper = styled.View`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
`;

export const VehicleInfoLine = styled.Text`
  flex-shrink: 1;
`;

export const VehicleInfoValue = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const RatingValueRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(3)}px;
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

export const TitleAcordion = styled.View`
  margin-left: 60px;
`;

export const ButtonSend = styled.TouchableOpacity`
  width: 100%;
  border-radius: 20px;
  margin-top: 10px;
  align-items: center;
  padding: 15px;
  background-color: ${({theme}) => theme.colors.primary};
`;
