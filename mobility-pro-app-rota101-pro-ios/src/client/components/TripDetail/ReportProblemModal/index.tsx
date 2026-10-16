import { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { translate } from '../../../locales';
import { customToast } from '../../../../utils/FlashMessage';
import { useTripReportTypes } from '../../../hooks/useTripReportTypes';
import { useReceipt } from '../../../contexts/Receipt';
import { ReportProblemModalProps } from './types';
import {
  MessageInput,
  ModalHeader,
  ModalOverlay,
  ModalSheet,
  ModalTitle,
  OptionLabel,
  OptionRadio,
  OptionRadioDot,
  OptionRow,
  SubmitButton,
  SubmitButtonText,
} from './styles';

export function ReportProblemModal({ visible, setVisible, tripReference }: ReportProblemModalProps) {
  const theme = useTheme();
  const { tripReportTypes, getTripReportTypes } = useTripReportTypes();
  const { reportTrip } = useReceipt();

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (visible) {
      getTripReportTypes();
    }
  }, [visible, getTripReportTypes]);

  const handleClose = () => {
    setVisible(false);
    setSelectedTypeId(null);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedTypeId) {
      return customToast(translate('detailsTrip.select_report_type_warning'), 'warning');
    }
    setSending(true);
    const success = await reportTrip(tripReference, selectedTypeId, message);
    setSending(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <ModalOverlay>
          <TouchableWithoutFeedback>
            <ModalSheet>
              <ModalHeader>
                <ModalTitle>{translate('myTravels.report_problem')}</ModalTitle>
                <TouchableWithoutFeedback onPress={handleClose}>
                  <MaterialIcons name="close" size={RFValue(20)} color={theme.colors.secondary} />
                </TouchableWithoutFeedback>
              </ModalHeader>

              {tripReportTypes.map(type => (
                <OptionRow
                  key={type.idTripReportType}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTypeId(type.idTripReportType)}
                >
                  <OptionRadio selected={selectedTypeId === type.idTripReportType}>
                    {selectedTypeId === type.idTripReportType && <OptionRadioDot />}
                  </OptionRadio>
                  <OptionLabel>{type.name}</OptionLabel>
                </OptionRow>
              ))}

              <MessageInput
                placeholder={translate('detailsTrip.report_problem_message_placeholder')}
                value={message}
                onChangeText={setMessage}
              />

              <SubmitButton disabled={sending} activeOpacity={0.7} onPress={handleSubmit}>
                <SubmitButtonText>{translate('contactUs.text_button_send')}</SubmitButtonText>
              </SubmitButton>
            </ModalSheet>
          </TouchableWithoutFeedback>
        </ModalOverlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
