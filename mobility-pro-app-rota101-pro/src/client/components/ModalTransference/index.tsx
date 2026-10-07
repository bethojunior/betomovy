import {useState, useEffect} from 'react';
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
import {useTransference} from '../../contexts/Transference';
import ModalFrame from '../form/Modal';
import Preload from '../Preload';
import {maskMoney, coinTypePerApi} from '../../utils/money';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
import {customToast} from '../../../utils/FlashMessage';

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
  realodBalance,
}: Props) => {
  const {makeWithdraw} = useTransference();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('0,00');

  const {cityConfig, generalSettings} = useAuth();


  const getGeneralSettingsValue = (key: string) => {
    const setting = generalSettings?.find(item => item.key === key);
    return setting ? setting.value : undefined;
  };

  const minimumWithdrawValue = getGeneralSettingsValue('minimum_value_for_partner_withdraw') || '0.00';

  useEffect(() => {
    if (!generalSettings || generalSettings.length === 0) {
      console.error('generalSettings is empty or undefined');
    } else {
      const keys = generalSettings.map(setting => setting.key);
    }
  }, [generalSettings]);

  const handleWithDraw = async (amount: string) => {
    const amountNumber = Number(amount.replace(/[^0-9]/g, '')) / 100;

    if (amount === '' || amount === '0,00' || amount === '0') {
      return customToast(translate('transfer.empty_value'), 'warning');
    }

    if (amountNumber < Number(minimumWithdrawValue)) {
      const minValueMessage = `${translate('transfer.min_value')} ${coinTypePerApi(cityConfig?.typeMoney)} ${minimumWithdrawValue}`;
      return customToast(minValueMessage, 'warning');
    }

    if (amountNumber > currentSald) {
      return customToast(translate('transfer.insuficient_value'), 'warning');
    }

    setLoading(true);
    const response = await makeWithdraw(amountNumber);
    if (!response.status) {
      setLoading(false);
      const minValueMessage = `${translate('transfer.min_value')} ${coinTypePerApi(cityConfig?.typeMoney)} ${minimumWithdrawValue}`;
      return customToast(minValueMessage, 'danger');
    }
    setValue('0,00');
    setLoading(false);
    setVisible(false);
    realodBalance();
    return customToast(translate('transfer.success_transfer'), 'success');
  };

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        textConfirm={translate('transfer.button_confirm_text')}
        onClose={() => {
          setVisible(false);
        }}
        onPressConfirm={() => handleWithDraw(value)}
      >
        <ContentTransferModal style={{alignItems: 'flex-end'}}>
          <ContentValue>
            <SimpleText>{translate('transfer.current_sald')}</SimpleText>
            <CurrentSald
              style={{
                textAlignVertical: 'center',
              }}
            >
              {coinTypePerApi(cityConfig?.typeMoney)}{' '}
              {maskMoney(
                currentSald - Number(value.replace(/[^0-9]/g, '')) / 100 || 0,
              )}
            </CurrentSald>
          </ContentValue>
          <ContentValue>
            <TitleValueTransfer>
              {translate('transfer.value_transfer')}
            </TitleValueTransfer>
            <InputMoney
              type={'money'}
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: cityConfig?.typeMoney,
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
            {translate('transfer.text_min_value')}{' '}
            {coinTypePerApi(cityConfig?.typeMoney)} {minimumWithdrawValue}
          </TextObservation>
        </ObservationContent>
        <ObservationContent>
          <Asterisk>* </Asterisk>
          <TextObservation>
            {translate('transfer.text_data_bank')}
          </TextObservation>
        </ObservationContent>
      </ModalFrame>
    </>
  );
};