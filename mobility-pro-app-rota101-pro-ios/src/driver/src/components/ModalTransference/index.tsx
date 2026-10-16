import { useState } from 'react';

import { BottomSheetModal } from '../../../../client/components/BottomSheetModal';
import { SheetHeader } from '../../../../client/components/SheetHeader';
import { useKeyboardHeight } from '../../../../common/hooks/useKeyboardHeight';
import Preload from '../Preload';
import { translate } from '../../../../client/locales';
import { useBank } from '../../context/bank';
import { customToast } from '../../../../utils/FlashMessage';
import { IModalTransference } from './modalTransferenceTypes';
import {
  Asterisk,
  ConfirmButton,
  ConfirmButtonText,
  ContentValue,
  CurrentSaldLabel,
  CurrentSaldValue,
  InputMoney,
  ObservationContent,
  SheetContent,
  TextObservation,
  TitleValueTransfer,
} from './styles';

export const ModalTransference = ({
  visible,
  setVisible,
  currentSald,
  realodBalance,
}: IModalTransference) => {
  const { requestWithdraw } = useBank();
  const keyboardHeight = useKeyboardHeight();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const closeModal = () => {
    setVisible(false);
    setValue('');
  };

  const handleWithDraw = async (amount: string) => {
    const amountNumber = Number(amount.replace(/[^0-9]/g, '')) / 100;

    if (!amount) {
      customToast(translate('account_driver_modal.empty_value'), 'warning');
      return;
    }

    if (amountNumber > currentSald) {
      customToast(translate('account_driver_modal.insuficient_value'), 'warning');
      return;
    }

    try {
      setLoading(true);
      const result = await requestWithdraw(amountNumber);
      setLoading(false);
      if (!result) return;
      setVisible(false);
    } catch (error) {
      setValue('');
      setLoading(false);
      setVisible(false);
    }
    realodBalance();
  };

  const handleTransferTextValue = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    const floatValue = parseFloat(numericValue) / 100;

    const formattedValue = floatValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    setValue(formattedValue);

    if (floatValue > currentSald) {
      customToast(translate('account_driver_modal.alert_max_value'), 'warning');
      setValue(
        `R$ ${currentSald.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
      );
    }
  };

  return (
    <>
      <Preload visible={loading} />
      <BottomSheetModal visible={visible} onRequestClose={closeModal}>
        <SheetHeader title={translate('account_driver_modal.transfer')} onClose={closeModal} />

        <SheetContent keyboardHeight={keyboardHeight}>
          <ContentValue>
            <CurrentSaldLabel>{translate('account_driver_modal.current_sald')}</CurrentSaldLabel>
            <CurrentSaldValue>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(currentSald)}
            </CurrentSaldValue>
          </ContentValue>

          <ContentValue>
            <TitleValueTransfer>{translate('account_driver_modal.value_transfer')}</TitleValueTransfer>
            <InputMoney
              testID="input_money_test"
              keyboardType="numeric"
              value={value}
              placeholder="R$ 0,00"
              onChangeText={handleTransferTextValue}
            />
          </ContentValue>

          <ObservationContent>
            <Asterisk>* </Asterisk>
            <TextObservation>{translate('account_driver_modal.text_data_bank')}</TextObservation>
          </ObservationContent>

          <ConfirmButton activeOpacity={0.7} onPress={() => handleWithDraw(value)}>
            <ConfirmButtonText>{translate('account_driver_modal.button_confirm_text')}</ConfirmButtonText>
          </ConfirmButton>
        </SheetContent>
      </BottomSheetModal>
    </>
  );
};
