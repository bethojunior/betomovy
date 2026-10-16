import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AnimatedLottieView from 'lottie-react-native';

interface ProgressBarrerProps {
  width: number;
}

export const ProgressContainer = styled.View`
  background-color: #fff;
  width: 100%;
  height: ${RFValue(42)}px;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

export const ProgressBarrer = styled.View<ProgressBarrerProps>`
  transition: 0.5s all;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  height: 30px;
  background-color: #4874d6;
  border-top-right-radius: ${({width}) => (width >= 100 ? 0 : 9.91)}px;
  border-bottom-right-radius: ${({width}) => (width >= 100 ? 0 : 9.91)}px;
  border-right-width: ${({width}) => (width > 100 ? 7 : 0)}px;
  border-right-color: red;
`;

export const ProgressBarrerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  width: 100%;
`;

export const ModalTitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 0.5px;
  border-bottom-color: #d8d8d8;
  padding-top: ${RFValue(2)}px;
  padding-bottom: ${RFValue(14)}px;
`;

export const ModalTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  padding-left: 4px;
`;

export const KmContainer = styled.View`
  padding-top: ${RFValue(14)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const KmTitle = styled.Text`
  font-weight: bold;
`;

export const AnimatedVehicleLottie = styled(AnimatedLottieView)`
  height: ${RFValue(24)}px;
  width: ${RFValue(24)}px;
  margin-left: ${RFValue(4)}px;
`;

export const AnimatedIconInfoLottie = styled(AnimatedLottieView)`
  height: ${RFValue(24)}px;
  width: ${RFValue(24)}px;
`;

export const TripDistanceContainer = styled.View`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  padding-left: 10px;
  padding-right: 10px;
`;

export const TripDistanceInfoText = styled.Text`
  color: black;
  font-weight: boldblack;
  font-size: ${RFValue(7)}px;
`;

export const TripDistanceRigthText = styled.Text`
  color: black;
  font-weight: boldblack;
  font-size: ${RFValue(7)}px;
  text-align: right;
`;
