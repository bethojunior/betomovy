import {Ionicons} from '@expo/vector-icons';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {customToast} from '../../../../utils/FlashMessage';
import {useReceipt} from '../../../contexts/Receipt';

import {useAuth} from '../../../../context/auth';

import {Alert} from 'react-native';

import {translate} from '../../../locales';

import Preload from '../../../components/Preload';

import {
  Container,
  ButtonBack,
  ButtonSend,
  Logo,
  TextArea,
  TitlePage,
  TextButtonSend,
} from './styles';

import theme from '../../../styles/theme';

export default function ContactUsSpeedMob({route}: any) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [exclude, setExclude] = useState<boolean>(false);
  const [textReason, setTextReason] = useState('');

  const navigation = useNavigation();

  const {postContactUs, postExcludeAccount} = useReceipt();
  const {user} = useAuth();

  const title = () => {
    if (route.params?.title) {
      return `${translate('contactUs.tell_us_about')} "${route.params.title}"`;
    }
    return `${translate('contactUs.tell_us_about')}`;;
  };

  const postMessageContactUs = async () => {
    if (!message) {
      return customToast(translate('contactUs.alert_incomplete'), 'warning');
    }

    if (exclude) {
      Alert.alert(
        translate('exclude.text_dialog_delete'),
        translate('exclude.text_dialog_delete_message'),
        [
          {
            text: translate('exclude.text_dialog_delete_cancel'),
            style: 'cancel',
          },
          {
            text: translate('exclude.text_dialog_delete_confirm'),
            onPress: async () => {
              postExcludeAccount(textReason, message);
            },
          },
        ],
      );
      return;
    }
    setLoading(true);
    await postContactUs(message, user?.idUser);
    setMessage('');
    setLoading(false);
  };

  useEffect(() => {
    if (route.params?.exclude) {
      setExclude(true);
    }
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ButtonBack onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} csolor={theme.colors.primary} />
      </ButtonBack>
      <Logo source={{uri: theme.images.logo}} />
      <TitlePage colorText={theme.colors.primary}>
        {title()}
      </TitlePage>
      <TextArea
        multiline
        value={message}
        onChangeText={text => setMessage(text)}
        placeholder={translate('contactUs.text_description')}
        style={{textAlignVertical: 'top', height: 300}}
      />
      <ButtonSend
        colorButton={theme.colors.primary}
        onPress={postMessageContactUs}
      >
        <TextButtonSend colorText={theme.colors.background_global}>
          {translate('contactUs.text_button_send')}
        </TextButtonSend>
      </ButtonSend>
    </Container>
  );
}
