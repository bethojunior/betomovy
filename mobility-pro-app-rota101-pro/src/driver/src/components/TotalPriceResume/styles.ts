import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const PriceContainerXl = styled.View`
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-bottom-width: 4px;
`;

export const TitlePriceText = styled.Text`
  font-size: ${RFValue(11)}px;
  font-family: MavenPro_600SemiBold;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  text-align: center;
`;

export const PriceTextXL = styled.Text`
  font-size: ${RFValue(36)}px;
  font-family: MavenPro_800ExtraBold;
  color: #0f172a;
  letter-spacing: -1px;
`;

export const PixButton = styled.TouchableOpacity`
  background-color: #32bcad;
  height: 52px;
  border-radius: 12px;
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

export const TextQrCode = styled.Text`
  font-size: 16px;
  font-family: MavenPro_600SemiBold;
  color: #ffffff;
`;

export const QRCodeContent = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
  align-items: center;
  width: 100%;
`

export const ApprovedText = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const PaymentApproved = styled.View`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 12px;
`;
