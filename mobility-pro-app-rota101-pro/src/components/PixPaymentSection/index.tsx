import { FC } from 'react';

import { translate } from '../../client/locales';
import { PixValueCard } from '../PixValueCard';
import { PixCard } from '../PixCard';
import { PixLoadingState } from '../PixLoadingState';
import { InfoText } from './styles';

interface PixPaymentSectionProps {
  pixCode: string;
  amount: string;
  noPixCodeText?: string;
  loading?: boolean;
  onCopy: () => void;
  onClose?: () => void;
}

const PixPaymentSection: FC<PixPaymentSectionProps> = ({
  pixCode,
  amount,
  noPixCodeText,
  loading,
  onCopy,
}) => {
  if (loading) {
    return <PixLoadingState />;
  }

  return (
    <>
      <PixValueCard amount={amount} expirationSeconds={300} />

      <PixCard
        pixCode={pixCode}
        onCopy={onCopy}
        showQrCode
        noPixCodeText={noPixCodeText}
      />

      <InfoText>{translate('paymentPage.information_pix')}</InfoText>
    </>
  );
};

export default PixPaymentSection;
