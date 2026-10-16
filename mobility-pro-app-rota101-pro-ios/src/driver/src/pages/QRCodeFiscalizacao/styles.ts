import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme?.colors?.background_global || '#f1f1f1'};
`;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: RFValue(16),
    paddingBottom: RFValue(32),
    alignItems: 'center',
  },
})`
  flex: 1;
`;

export const ShareableContent = styled.View`
  background-color: #ffffff;
  border-radius: ${RFValue(16)}px;
  overflow: hidden;
  width: 100%;
  max-width: ${RFValue(350)}px;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
`;

export const HeaderCard = styled.View`
  background-color: ${({ theme }) => theme?.colors?.primary || '#00349a'};
  padding: ${RFValue(24)}px ${RFValue(20)}px;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme?.fonts?.bold || 'Roboto_700Bold'};
  color: #ffffff;
  margin-bottom: ${RFValue(8)}px;
  text-align: center;
`;

export const VehicleName = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme?.fonts?.medium || 'Roboto_500Medium'};
  color: #ffffff;
  margin-bottom: ${RFValue(12)}px;
  text-align: center;
`;

export const PlateContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: ${RFValue(8)}px;
  padding: ${RFValue(10)}px ${RFValue(20)}px;
  margin-top: ${RFValue(4)}px;
`;

export const PlateText = styled.Text`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme?.fonts?.bold || 'Roboto_700Bold'};
  color: #ffffff;
  letter-spacing: ${RFValue(2)}px;
  text-align: center;
`;

export const QRCodeSection = styled.View`
  background-color: #ffffff;
  padding: ${RFValue(24)}px;
  align-items: center;
  justify-content: center;
`;

export const QRCodeWrapper = styled.View`
  background-color: #ffffff;
  border-width: ${RFValue(3)}px;
  border-color: ${({ theme }) => theme?.colors?.primary || '#00349a'};
  border-radius: ${RFValue(12)}px;
  padding: ${RFValue(16)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const InstructionText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme?.fonts?.regular || 'Roboto_400Regular'};
  color: ${({ theme }) => theme?.colors?.text_gray || '#666'};
  text-align: center;
  line-height: ${RFValue(20)}px;
  padding-horizontal: ${RFValue(8)}px;
`;

export const FooterCard = styled.View`
  background-color: ${({ theme }) => theme?.colors?.primary || '#00349a'};
  padding: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const FooterText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme?.fonts?.medium || 'Roboto_500Medium'};
  color: #ffffff;
  margin-left: ${RFValue(8)}px;
  text-align: center;
`;

export const ShareButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme?.colors?.primary || '#00349a'};
  border-radius: ${RFValue(12)}px;
  padding: ${RFValue(16)}px;
  margin-top: ${RFValue(24)}px;
  width: 100%;
  max-width: ${RFValue(350)}px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
`;

export const ShareButtonText = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme?.fonts?.bold || 'Roboto_700Bold'};
  color: #ffffff;
  margin-left: ${RFValue(12)}px;
`;
