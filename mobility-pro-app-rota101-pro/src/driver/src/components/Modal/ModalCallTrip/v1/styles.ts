import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {lighten, darken, desaturate, getLuminance} from 'polished';

const blockedColor = (color: string): string => {
  const desaturated = desaturate(0.5, color);
  return getLuminance(color) > 0.5
    ? darken(0.05, desaturated)
    : lighten(0.35, desaturated);
};

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
  show: boolean;
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
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  z-index: 10;
  elevation: 12;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  min-height: 350px;
  padding: 16px 14px 14px 14px;
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
  align-items: center;
  gap: 10px;
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
  padding: 8px 12px;
  align-items: center;
  background-color: #f8fafc;
  border-radius: 12px;
  margin-bottom: 8px;
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
  font-weight: 800;
  font-size: ${RFValue(21)}px;
  justify-content: center;
  color: #ffffff;
  font-family: MavenPro_700Bold;
  letter-spacing: 0.3px;
`;

export const Bonus = styled.Text`
  font-weight: bold;
  font-size: ${RFValue(18)}px;
  justify-content: center;
  color: ${({theme}) => theme.colors.primary};
  font-family: MavenPro_400Regular;
`;

export const AddressContent = styled.View`
  margin-top: 10px;
  flex-direction: row;
  background-color: #f8fafc;
  border-radius: 14px;
  padding: 10px 12px;
`;

export const PointsContent = styled.View`
  padding: 6px 0;
  align-items: center;
`;

export const Ball = styled.View`
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border-radius: 6px;
  border-width: 2px;
  border-color: #ffffff;
  elevation: 2;
`;

export const Square = styled.View`
  width: 12px;
  height: 12px;
  background-color: #ef4444;
  border-radius: 3px;
  border-width: 2px;
  border-color: #ffffff;
  elevation: 2;
`;

export const Line = styled.View`
  border-right-width: 1.5px;
  border-right-color: #cbd5e1;
  min-height: 20px;
  flex: 1;
  width: 1px;
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
  padding: 2px 6px;
  font-size: ${({waypoint}) => (waypoint ? '13px' : '14px')};
  font-family: MavenPro_500Medium;
  color: ${({riskArea}) => (riskArea ? '#ef4444' : '#1e293b')};
  line-height: 18px;
`;

export const ButtonContent = styled.View`
  margin-top: 14px;
  width: 100%;
  align-self: center;
  align-items: stretch;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px;
`;

export const ButtonRefuse = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  padding: 8px;
`;

export const ButtonReject = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.06);
  border-width: 1.5px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

export const ButtonAccept = styled.TouchableOpacity`
  flex: 1.4;
  height: 52px;
  border-color: #00349a;
  background-color: #00349a;
  border-width: 1px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  elevation: 4;
  shadow-color: #00349a;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

export const ProgressBarrer = styled.View<ProgressProps>`
  height: 52px;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.22);
  position: absolute;
`;

export const TextButton = styled.Text`
  color: #ffffff;
  font-family: MavenPro_700Bold;
  font-size: 18px;
  letter-spacing: 0.5px;
`;

export const SimpleText = styled.Text`
  color: #0f172a;
  font-family: MavenPro_700Bold;
  font-size: 16px;
`;

export const Label = styled.Text`
  font-size: 11px;
  font-family: MavenPro_500Medium;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Info = styled.Text`
  font-size: 15px;
  font-family: MavenPro_700Bold;
  color: #0f172a;
`;

export const Distance = styled.Text`
  font-family: MavenPro_700Bold;
  padding-left: 6px;
  margin-top: 1px;
  font-size: ${RFValue(13)}px;
  color: #00349a;
`;

export const FavoriteText = styled.Text<FavoriteTextProps>`
  color: ${({theme, show}) =>
    show ? theme.colors.primary : theme.colors.background_global};
  font-size: 18px;
  text-transform: ${({show}) => (show ? 'uppercase' : 'none')};
  margin-left: 5px;
  font-family: MavenPro_700Bold;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
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
  padding: 12px 10px 10px 10px;
`;
