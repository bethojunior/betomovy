import {useState} from 'react';
import {View} from 'react-native';
import {Content, TextArea, Title} from './styles';
import {translate} from '../../../../client/locales';
import ModalFrame from '../form/ModalFrame';
import {TextEdit} from '../TextEdit';
import {useMyTravels} from '../../context/MyTravel';
import {customToast} from '../../../../utils/FlashMessage';

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
  const {reportTrip} = useMyTravels();

  const [message, setMessage] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);

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
    setVisible(false);
  };

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => setVisible(false)}
      onPressConfirm={postMessageContactUs}
      isLoading={loadingSend}
    >
      <View style={{maxHeight: 400}}>
        <Title>
          {translate('myTravels.did_you_have_any_problems_this_trip')}
        </Title>
        <Content>
          <TextEdit size="small">{translate('myTravels.report_us')}</TextEdit>
          <TextArea
            multiline
            onSubmitEditing={() => postMessageContactUs()}
            value={message}
            placeholder={translate('contactUs.text_description')}
            onChangeText={e => setMessage(e)}
            style={{textAlignVertical: 'top', height: 300}}
          />
        </Content>
      </View>
    </ModalFrame>
  );
}
