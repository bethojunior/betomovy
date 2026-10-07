import { ActivityIndicator, Text } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Helper from "~/client/utils/Helper"
import { getTripPaymentFormDisplay } from '../../utils/tripUtils';
import {
  ApprovedText,
  PaymentApproved,
  PixButton,
  PriceContainerXl,
  PriceTextXL,
  QRCodeContent,
  TextQrCode,
  TitlePriceText
} from "./styles"
import QRCode from "react-native-qrcode-svg";

export const TotalPriceResume = ({
  typeMoney,
  selectedPrice,
  tripAccepted,
  showPixButton,
  handlePix,
  loadingPix,
  generate,
  pixCode,
  pixStatus
}) => {
  return (
    <PriceContainerXl>
      <TitlePriceText>TOTAL A RECEBER</TitlePriceText>
      <PriceTextXL>
        {typeMoney} {Helper.maskMoney(Number(selectedPrice ?? tripAccepted?.price ?? 0))}
      </PriceTextXL>
      <TitlePriceText>{getTripPaymentFormDisplay(tripAccepted?.tripPaymentForm)}</TitlePriceText>

      {showPixButton && (
        <PixButton activeOpacity={0.7} onPress={handlePix} disabled={loadingPix}>
          {loadingPix ? <ActivityIndicator color="#fff" /> : (
            <>
              <AntDesign name="qrcode" size={20} color="#fff" />
              <TextQrCode>Gerar QR Code PIX</TextQrCode>
            </>
          )}
        </PixButton>
      )}
      {generate && (
        <QRCodeContent>
          <QRCode
            value={pixCode || ''}
            size={150}
            backgroundColor="#ffffff"
            color="#000000"
          />
          <ApprovedText style={{ marginTop: 6 }}>
            {pixStatus === "1" && (
              <PaymentApproved>
                <AntDesign name="check-circle" size={20} color="green" />
                <Text style={{ marginLeft: 5 }}>Pagamento recebido</Text>
              </PaymentApproved>
            )}
          </ApprovedText>
        </QRCodeContent>
      )}
    </PriceContainerXl>
  )
}