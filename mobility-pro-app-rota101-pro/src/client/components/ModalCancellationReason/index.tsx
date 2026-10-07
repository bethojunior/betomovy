import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { translate } from '../../locales';
import { useTrip } from '../../contexts/Trip';
import { BottomSheetModal } from '../BottomSheetModal';
import {
  CloseButton,
  ConfirmButton,
  ConfirmButtonText,
  Content,
  HeaderRow,
  HeaderTextGroup,
  IconCircle,
  ReasonCard,
  ReasonList,
  ReasonName,
  Subtitle,
  Title,
} from './styles';
import theme from '../../styles/theme';
import { customToast } from '../../../utils/FlashMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CancellationReason, ModalCancellationReasonsCustomerProps } from './types';

export const ModalCancellationReasonsCustomer = ({
  visible,
  setVisible,
}: ModalCancellationReasonsCustomerProps) => {
  const [listReasons, setListReasons] = useState<CancellationReason[]>([]);
  const [idSelected, setIdSelected] = useState(0);

  const { getCancellationReasons, cancelTripByCustomer } = useTrip();

  const handleClose = () => {
    setVisible(false);
    setIdSelected(0);
  };

  const showAlert = async () => {
    setVisible(false);
    return Alert.alert(
      translate('trip.cancel_trip'),
      translate('trip.text_dialog_cancel'),
      [
        {
          text: translate('cleanBagModal.text_confirmed'),
          onPress: async () => {
            const canceled = await cancelTripByCustomer(idSelected);
            setIdSelected(0);
            if (!canceled) return;

            await AsyncStorage.removeItem('waitingTimer');
            customToast(translate('trip.your_trip_has_been_canceled'), 'success');
          },
        },
        {
          text: translate('cleanBagModal.text_denied'),
          onPress: () => setIdSelected(0),
        },
      ],
      { cancelable: false },
    );
  };

  useEffect(() => {
    const get = async () => {
      setListReasons(await getCancellationReasons());
    };

    get();
  }, []);

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <Content>
        <HeaderRow>
          <IconCircle>
            <Ionicons name="alert-circle" size={RFValue(22)} color={theme.colors.destructive} />
          </IconCircle>

          <HeaderTextGroup>
            <Title>{translate('trip.cancel_trip')}?</Title>
            <Subtitle>{translate('trip.why_you_want_cancel_trip')}</Subtitle>
          </HeaderTextGroup>

          <CloseButton activeOpacity={0.7} onPress={handleClose}>
            <Ionicons name="close" size={RFValue(16)} color={theme.colors.text_gray} />
          </CloseButton>
        </HeaderRow>

        <ReasonList>
          {listReasons?.map(item => {
            const selected = item.idCancellationReasons === idSelected;

            return (
              <ReasonCard
                key={item.idCancellationReasons}
                activeOpacity={0.8}
                selected={selected}
                onPress={() => setIdSelected(item.idCancellationReasons)}
              >
                <ReasonName selected={selected}>{item.name}</ReasonName>
                <Ionicons
                  name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={RFValue(20)}
                  color={selected ? theme.colors.primary : theme.colors.grayLight}
                />
              </ReasonCard>
            );
          })}
        </ReasonList>

        {idSelected !== 0 && (
          <ConfirmButton activeOpacity={0.7} onPress={showAlert}>
            <ConfirmButtonText>{translate('dialog.confirm')}</ConfirmButtonText>
          </ConfirmButton>
        )}
      </Content>
    </BottomSheetModal>
  );
};
