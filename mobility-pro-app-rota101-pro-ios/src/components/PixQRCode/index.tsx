import { FC } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QRContainer } from './styles';

interface PixQRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  showBorder?: boolean;
  noValueText?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const PixQRCode: FC<PixQRCodeProps> = ({
  value,
  size = 160,
  color = 'black',
  backgroundColor = 'white',
  showBorder = true,
  noValueText,
  contentContainerStyle,
}) => {
  if (!value) {
    if (!noValueText) return null;

    return (
      <QRContainer showBorder={showBorder} style={contentContainerStyle}>
        <Text>{noValueText}</Text>
      </QRContainer>
    );
  }

  return (
    <QRContainer showBorder={showBorder} style={contentContainerStyle}>
      <QRCode value={value} size={size} color={color} backgroundColor={backgroundColor} />
    </QRContainer>
  );
};

export default PixQRCode;
