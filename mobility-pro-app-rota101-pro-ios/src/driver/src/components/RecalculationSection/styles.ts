import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface SectionTripRewardProps {
  visible: boolean;
}

interface ChoosePriceProps {
  isOriginal?: boolean;
}

export const SectionTripReward = styled.View<SectionTripRewardProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  background-color: #ffffff;
  border-radius: 14px;
  padding: 16px;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  elevation: 2;
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_600SemiBold;
  color: #1f2933;
  text-align: center;
  margin-bottom: 12px;
`;

export const TextReward = styled.Text`
  font-size: 14px;
  font-family: MavenPro_400Regular;
  color: #4b5563;
  line-height: 20px;
  margin-bottom: 12px;
`;

export const ContainerChoosePrice = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

export const ButtonChoosePrice = styled.TouchableOpacity<ChoosePriceProps>`
  background-color: #ffffff;
  border-radius: 10px;
  height: 64px;
  width: 48%;
  border: 1px solid #e5e7eb;

  align-items: center;
  justify-content: center;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.04;
  shadow-radius: 2px;
  elevation: 1;

  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
`;

export const ContentChoosePrice = styled.View`
  align-items: center;
  height: 100%;
  justify-content: center;
`;

export const TitleChoosePrice = styled.Text`
  font-size: 13px;
  font-family: MavenPro_500Medium;
  color: #6b7280;
`;

export const Price = styled.Text`
  font-size: 18px;
  font-family: MavenPro_600SemiBold;
  color: #111827;
  margin-top: 4px;
`;

export const PriceContainer = styled.View`
  background-color: #f3f4f6;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 12px;
  align-items: center;
  width: 100%;
`;

export const ValueText = styled.Text`
  font-size: 13px;
  color: #6b7280;
`;

export const PriceText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  margin-top: 4px;
`;
