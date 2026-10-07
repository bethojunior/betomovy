import {FC, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {BottomSheetModal} from '../../BottomSheetModal';
import {useKeyboardHeight} from '../../../../common/hooks/useKeyboardHeight';
import {usePaymentForm} from '../../../contexts/paymentForms';
import {useLocal} from '../../../contexts/local';
import {translate} from '../../../locales';
import theme from '../../../styles/theme';
import {isCouponCodeValid} from './couponCodeValidation';
import {
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ContentButton,
  Input,
  InputWrapper,
  ScrollContent,
  Title,
  TitleRow,
} from './styles';
import {AddCoupomProps} from './types';

/**
 * Bottom sheet pra digitar o código de um cupom — mesmo padrão visual dos
 * outros modais do app (BottomSheetModal + useKeyboardHeight empurrando o
 * conteúdo acima do teclado nativo, como em DeleteAccountModal/ChangePasswordModal).
 * Validação do código e chamada de API ficam isoladas fora do JSX.
 */
const AddCoupom: FC<AddCoupomProps> = ({visible, setVisible, updateList}) => {
  const keyboardHeight = useKeyboardHeight();
  const {position} = useLocal();
  const {addCoupon} = usePaymentForm();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = isCouponCodeValid(code) && !loading;

  const handleClose = () => {
    setVisible(false);
    setCode('');
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;

    setLoading(true);
    await addCoupon(code, position?.latitude, position?.longitude);
    setLoading(false);

    setCode('');
    setVisible(false);
    updateList();
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <ScrollContent keyboardHeight={keyboardHeight}>
        <TitleRow>
          <MaterialIcons name="local-offer" size={RFValue(18)} color={theme.colors.primary} />
          <Title>{translate('paymentPage.title_enter_code_coupon')}</Title>
        </TitleRow>

        <InputWrapper>
          <Input autoCapitalize="characters" value={code} onChangeText={setCode} editable={!loading} />
        </InputWrapper>

        <ContentButton>
          <CancelButton activeOpacity={0.7} onPress={handleClose}>
            <CancelButtonText>{translate('buttonModal.cancel')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton activeOpacity={0.7} disabled={!canSubmit} onPress={handleConfirm}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primaryText} />
            ) : (
              <ConfirmButtonText>{translate('buttonModal.confirm')}</ConfirmButtonText>
            )}
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
};

export default AddCoupom;
