import {useState} from 'react';
import {
  Asterisk,
  ContentTransferModal,
  ContentValue,
  CurrentSald,
  InputMoney,
  ObservationContent,
  SimpleText,
  TextObservation,
  TitleValueTransfer,
} from './styles';
import ModalFrame from '../form/ModalFrame';
import Preload from '../Preload';
import {maskMoney} from '../../utils/money';
import {translate} from '../../../../client/locales';
import {useBank} from '../../context/bank';
import {If} from '../If';
import {customToast} from '../../../../utils/FlashMessage';
import {useAuth} from '../../../../context/auth';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  currentSald: any;
  realodBalance: () => void;
}

export const ModalTransference = ({
  visible,
  setVisible,
  currentSald,
  realodBalance
}: Props) => {
  const {requestWithdraw} = useBank();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('0,00');

  const {cityConfig} = useAuth();

  const handleWithDraw = async (amount: string) => {
    const amountNumber = Number(amount.replace(/[^0-9]/g, '')) / 100;

    if (amount === '' || amount === '0,00' || amount === '0') {
      return customToast(
        translate('account_driver_modal.empty_value'),
        'warning',
      );
    }

    if (amountNumber > currentSald) {
      return customToast(
        translate('account_driver_modal.insuficient_value'),
        'warning',
      );
    }

    setLoading(true);
    const response = await requestWithdraw(amountNumber);
    if (!response) {
      return setLoading(false);
    }
    setValue('0,00');
    setLoading(false);
    setVisible(false);
    return realodBalance();
  };

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        textConfirm={translate('account_driver_modal.button_confirm_text')}
        onClose={() => {
          setVisible(false);
        }}
        onPressConfirm={() => handleWithDraw(value)}
      >
        <ContentTransferModal>
          <ContentValue>
            <SimpleText>
              {translate('account_driver_modal.current_sald')}
            </SimpleText>
            <CurrentSald
              style={{
                textAlignVertical: 'center',
              }}
            >
              {cityConfig.typeMoney}{' '}
              {maskMoney(
                currentSald - Number(value.replace(/[^0-9]/g, '')) / 100 || 0,
              )}
            </CurrentSald>
          </ContentValue>
          <ContentValue>
            <TitleValueTransfer>
              {translate('account_driver_modal.value_transfer')}
            </TitleValueTransfer>
            <InputMoney
              type={'money'}
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$',
                suffixUnit: '',
              }}
              value={value}
              onChangeText={text => {
                setValue(text);
              }}
              returnKeyType="done"
            />
          </ContentValue>
        </ContentTransferModal>
        <ObservationContent>
          <Asterisk>* </Asterisk>
          <TextObservation>
            {translate('account_driver_modal.text_data_bank')}
          </TextObservation>
        </ObservationContent>

        <If condition={loading === true}>
          <Preload visible={loading} />
        </If>
      </ModalFrame>
    </>
  );
};
