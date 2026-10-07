import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #f6f7f9;
  padding: 20px;
`;

export const CardInfo = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  margin-bottom: 24px;

  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

export const ClientRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ClientDetails = styled.View`
  margin-left: 15px;
  flex: 1;
`;

export const ClientPhoto = styled.Image`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  border-width: 3px;
  border-color: #f1f5f9;
`;

export const NameClient = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(18)}px;
  color: #0f172a;
  margin-bottom: 4px;
`;

export const AssessmentSection = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_600SemiBold;
  color: #1f2933;
  text-align: center;
  margin-bottom: 12px;
`;

export const TitleResume = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: MavenPro_600SemiBold;
  color: #495057;
  margin-bottom: 8px;
  opacity: 0.8;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  height: 56px;
  border-radius: 14px;
  margin-top: 28px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const TextButton = styled.Text`
  font-size: 16px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const FixedFooter = styled.View`
  width: 100%;
  background-color: #ffffff;
  padding: 20px;

  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 10;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const GroupCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 8px 16px;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 3;
`;

export const ItemSeparator = styled.View`
  height: 1px;
  background-color: #f1f5f9;
  width: 100%;
`;

export const ItemWrapper = styled.View`
  padding: 16px 0;
`;
