import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../client/locales';
import { useTripProvider } from '../../../context/Trip';
import {
  ButtonConfirm,
  ButtonConfirmText,
  ButtonDismiss,
  ButtonDismissText,
  ButtonReason,
  CloseButton,
  ContainerAll,
  ContainerButton,
  Content,
  Description,
  Header,
  HeaderTitle,
  Overlay,
  RadioIndicator,
  ReasonName,
} from './styles';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  cancelTripAccepted: (id: number) => void;
}

interface CancellationReasonItem {
  idCancellationReasons: number;
  name: string;
}

const DEFAULT_REASONS: CancellationReasonItem[] = [
  { idCancellationReasons: 3, name: 'Passageiro não compareceu' },
  { idCancellationReasons: 1, name: 'Problema mecânico com o veículo' },
  { idCancellationReasons: 2, name: 'Trânsito intenso / Bloqueio na via' },
  { idCancellationReasons: 4, name: 'Outros motivos operacionais' },
];

export const ModalCancellationReasons: React.FC<ModalProps> = ({
  visible,
  setVisible,
  cancelTripAccepted,
}) => {
  const [listReasons, setListReasons] = useState<CancellationReasonItem[]>(DEFAULT_REASONS);
  const [idSelected, setIdSelected] = useState<number>(3);

  const getCancellationReasons = useTripProvider(
    (context: any) => context.getCancellationReasons,
  );
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      const fetchReasons = async () => {
        try {
          const res = await getCancellationReasons();
          if (Array.isArray(res) && res.length > 0) {
            setListReasons(res);
            setIdSelected(res[0].idCancellationReasons);
          } else {
            setListReasons(DEFAULT_REASONS);
            setIdSelected(DEFAULT_REASONS[0].idCancellationReasons);
          }
        } catch {
          setListReasons(DEFAULT_REASONS);
          setIdSelected(DEFAULT_REASONS[0].idCancellationReasons);
        }
      };

      fetchReasons();
    }
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    const reasonId = idSelected || (listReasons[0]?.idCancellationReasons ?? 3);
    cancelTripAccepted(reasonId);
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Overlay>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <ContainerAll>
              <Header>
                <HeaderTitle>
                  {translate('trip.cancel_trip') || 'Cancelar Corrida'}
                </HeaderTitle>
                <CloseButton activeOpacity={0.7} onPress={handleClose}>
                  <Feather name="x" size={RFValue(20)} color={theme.colors.secondary || '#6B7280'} />
                </CloseButton>
              </Header>

              <Description>
                {translate('trip.why_you_want_cancel_trip') ||
                  'Selecione o motivo pelo qual você deseja cancelar a corrida:'}
              </Description>

              <Content showsVerticalScrollIndicator={false}>
                {listReasons.map((item) => {
                  const isSelected = item.idCancellationReasons === idSelected;
                  return (
                    <ButtonReason
                      activeOpacity={0.8}
                      key={item.idCancellationReasons}
                      onPress={() => setIdSelected(item.idCancellationReasons)}
                      selected={isSelected}
                    >
                      <ReasonName selected={isSelected}>{item.name}</ReasonName>
                      <RadioIndicator selected={isSelected}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        )}
                      </RadioIndicator>
                    </ButtonReason>
                  );
                })}
              </Content>

              <ContainerButton>
                <ButtonConfirm activeOpacity={0.85} onPress={handleConfirm}>
                  <ButtonConfirmText>
                    {translate('dialog.confirm') || 'Confirmar Cancelamento'}
                  </ButtonConfirmText>
                </ButtonConfirm>

                <ButtonDismiss activeOpacity={0.7} onPress={handleClose}>
                  <ButtonDismissText>Voltar para a Corrida</ButtonDismissText>
                </ButtonDismiss>
              </ContainerButton>
            </ContainerAll>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
