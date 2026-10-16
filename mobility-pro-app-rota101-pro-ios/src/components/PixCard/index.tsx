import { FC } from 'react';
import { translate } from '../../client/locales';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { PixQRCode } from '../PixQRCode';

import {
  Container,
  CopyButton,
  CopyButtonIcon,
  CopyButtonText,
  Description,
  Divider,
  FieldContainer,
  FieldValue,
  Header,
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';

interface PixCardProps {
  pixCode: string;
  onCopy: () => void;
  showQrCode?: boolean;
  noPixCodeText?: string;
}

export const PixCard: FC<PixCardProps> = ({
  pixCode,
  onCopy,
  showQrCode = false,
  noPixCodeText,
}) => {
  return (
    <Container>
      <Header>
        <FontAwesome6 name="pix" size={RFValue(32)} color="#37B4AA" />
        <Description>
          {translate(
            showQrCode
              ? 'paymentPage.payment_pix_instructions'
              : 'paymentPage.payment_pix_instructions_copy_paste',
          )}
        </Description>
      </Header>

      {showQrCode && (
        <PixQRCode
          contentContainerStyle={{ paddingTop: 10 }}
          value={pixCode}
          noValueText={noPixCodeText}
          showBorder={false}
        />
      )}

      <Divider />

      <FieldContainer>
        <FieldValue numberOfLines={1} ellipsizeMode="tail">
          {pixCode || ''}
        </FieldValue>
      </FieldContainer>

      <CopyButton onPress={onCopy} activeOpacity={0.8}>
        <CopyButtonIcon name="copy" />
        <CopyButtonText>{translate('paymentPage.copy_code')}</CopyButtonText>
      </CopyButton>
    </Container>
  );
};

export default PixCard;
