import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {lighten} from 'polished';
import {MotiView} from 'moti';
import {RFValue} from 'react-native-responsive-fontsize';

type SectionProps = {
  isFirst?: boolean;
};

type AddressProps = {
  riskArea?: boolean;
  waypoint?: boolean;
};

type ProgressProps = {
  width: number;
};

type FavoriteTextProps = {
  display: boolean;
};

type RiskAreaProps = {
  visible: boolean;
};

export const Modal = styled(MotiView)`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  align-self: center;
  position: absolute;
  bottom: 0;
  border-radius: 8px;
  z-index: 10;
  elevation: 5;
  min-height: 350px;
  padding: 15px 10px 10px 10px;
  border-radius: 10px;
`;

export const Photo = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 50px;
  margin-right: 10px;
`;

export const ClientRating = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const ClientInfoContent = styled.View`
  flex-direction: row;
  padding-bottom: 10px;
`;

export const ClienSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ClientInfo = styled.View`
  justify-content: space-between;
  flex-direction: row;
  width: 75%;
`;

export const AddressSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const SectionInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
`;

export const DynamicContent = styled.View`
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 50px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Section = styled.View<SectionProps>`
  width: ${({isFirst}) => (isFirst ? '48%' : '48%')};
`;

export const Price = styled.Text`
  font-weight: bold;
  font-size: ${RFValue(23)}px;
  justify-content: center;
  color: ${({theme}) => theme.colors.primaryText};
  font-family: MavenPro_400Regular;
`;

export const Bonus = styled.Text`
  font-weight: bold;
  font-size: ${RFValue(18)}px;
  justify-content: center;
  color: ${({theme}) => theme.colors.primary};
  font-family: MavenPro_400Regular;
`;

export const AddressContent = styled.View`
  margin-top: 15px;
  flex-direction: row;
`;

export const PointsContent = styled.View`
  padding: 10px 0;
`;

export const Ball = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
`;

export const Square = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Line = styled.View`
  border-right-width: 1px;
  border-right-color: ${({theme}) => theme.colors.secondary};
  min-height: 10px;
  flex: 1;
  width: 0.5px;
  align-self: center;
  border-style: ${Platform.OS === 'ios' ? 'solid' : 'dashed'};
`;

export const Toll = styled.Text`
  font-family: MavenPro_500Medium;
  margin-top: -5px;
  font-size: 14px;
  margin-right: 10px;
  font-weight: bold;
`;

export const Address = styled.Text<AddressProps>`
  padding: 5px;
  font-size: ${({waypoint}) => (waypoint ? '14px' : '16px')};
  font-family: MavenPro_400Regular;
  color: ${({theme, riskArea}) => (riskArea ? 'red' : theme.colors.secondary)};
  text-align: justify;
`;

export const ButtonContent = styled.View`
  margin-top: 20px;
  width: 100%;
  align-self: center;
  align-items: center;
  align-content: flex-end;
`;

export const ButtonRefuse = styled.TouchableOpacity`
  align-items: center;
  justify-content: flex-start;
  align-self: flex-end;
  margin-right: 10px;
  z-index: 5;
  margin-top: -6px;
  padding: 10px;
`;

export const ButtonAccept = styled.TouchableOpacity`
  width: 97%;
  height: 50px;
  border-color: ${({theme}) => theme.colors.primary};
  background-color: ${({theme}) => lighten(0.3, theme.colors.primary)};
  border-width: 0.5px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const ProgressBarrer = styled.View<ProgressProps>`
  transition: 1.5s all;
  height: 50px;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  height: 49px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
`;

export const TextButton = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-family: MavenPro_500Medium;
  font-size: 20px;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  font-size: 15px;
`;

export const Label = styled.Text`
  font-size: 15px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Info = styled.Text`
  font-size: 17px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Distance = styled.Text`
  font-family: MavenPro_400Regular;
  padding-left: 7px;
  margin-top: -5px;
  font-size: ${RFValue(18)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const FavoriteText = styled.Text<FavoriteTextProps>`
  color: ${({theme, display}) =>
    display ? theme.colors.primary : theme.colors.background_global};
  font-size: 18px;
  text-transform: ${({display}) => (display ? 'uppercase' : 'none')};
  margin-left: 5px;
  font-family: MavenPro_700Bold;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 20px;
`;

export const TextCalc = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const CalcContent = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  width: 100%;
  padding: 5px 8px 5px 0px;
  align-items: flex-end;
`;

export const RiskAreaContent = styled.View<RiskAreaProps>`
  width: 50%;
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: 5px;
  background-color: red;
  margin-top: -10px;
  padding: 5px 0 5px 0;
  display: ${({visible}) => (visible ? 'flex' : 'none')};
`;

export const TextRisk = styled.Text`
  font-size: 18px;
  font-family: MavenPro_600SemiBold;
  color: #fff;
`;

export const ContainerTurbine = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const GeneralContent = styled.View`
  overflow: hidden;
  flex: 1;
  position: relative;
  padding: 15px 10px 10px 10px;
`;
