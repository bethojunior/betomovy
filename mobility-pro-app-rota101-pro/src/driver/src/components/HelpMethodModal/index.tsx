import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetModal } from '../../../../client/components/BottomSheetModal';
import {
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ContentButton,
  IconBadge,
  ScrollContent,
  Subtitle,
  TextArea,
  Title,
  TitleColumn,
  TitleRow,
} from './styles';
import { translate } from '../../../../client/locales';
import theme from '../../styles/theme';
import { useMyTravels } from '../../context/MyTravel';
import { customToast } from '../../../../utils/FlashMessage';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  tripReference: string;
}

export default function HelpMethodModal({
  visible,
  setVisible,
  tripReference,
}: Props) {
  const { reportTrip } = useMyTravels();

  const [message, setMessage] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setMessage('');
  };

  const postMessageContactUs = async () => {
    if (message === '') {
      return customToast(translate('myTravels.fill_all_fields'), 'warning');
    }
    setLoadingSend(true);
    const response = await reportTrip(tripReference, message);
    if (!response.status) {
      customToast(translate('myTravels.text_error_contact'), 'danger');
    }
    customToast(translate('myTravels.text_success_contact'), 'success');
    setLoadingSend(false);
    handleClose();
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <ScrollContent>
        <TitleRow>
          <IconBadge>
            <Feather name="alert-circle" size={20} color={theme.colors.red} />
          </IconBadge>
          <TitleColumn>
            <Title>{translate('myTravels.did_you_have_any_problems_this_trip')}</Title>
            <Subtitle>{translate('myTravels.report_us')}</Subtitle>
          </TitleColumn>
        </TitleRow>

        <TextArea
          value={message}
          placeholder={translate('contactUs.text_description')}
          onChangeText={setMessage}
          onSubmitEditing={postMessageContactUs}
        />

        <ContentButton>
          <CancelButton onPress={handleClose} activeOpacity={0.7}>
            <Feather name="x" size={16} color={theme.colors.secondary} />
            <CancelButtonText>{translate('driver_buttonModal.cancel')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton onPress={postMessageContactUs} disabled={loadingSend} activeOpacity={0.7}>
            {loadingSend ? (
              <ActivityIndicator size="small" color={theme.colors.primaryText} />
            ) : (
              <>
                <Feather name="send" size={16} color={theme.colors.primaryText} />
                <ConfirmButtonText>{translate('driver_buttonModal.confirm')}</ConfirmButtonText>
              </>
            )}
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
}
