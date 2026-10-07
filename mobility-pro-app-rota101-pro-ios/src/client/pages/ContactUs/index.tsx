import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Container,
  ContainerText,
  Content,
  ContentLogo,
  Image,
  Subtitle,
  TextArea,
  Input,
  ViewButton,
} from './styles';
import logo from '../../../../assets/logo.png';
import {ButtonSmall} from '../../components/ButtonSmall';
import {useReceipt} from '../../contexts/Receipt';
import {customToast} from '../../../utils/FlashMessage';
import Preload from '../../components/Preload';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';
import {If} from '../../components/If';
import {lighten} from 'polished';
import {Alert} from 'react-native';

export const ContactUs = ({route}: any) => {
  const {postContactUs, postExcludeAccount} = useReceipt();
  const {user} = useAuth();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [exclude, setExclude] = useState(false);
  const [textReason, setTextReason] = useState('');

  const title = () => {
    if (route.params?.title) {
      return `${translate('contactUs.tell_us_about')} "${route.params.title}"`;
    }
    return '';
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
      <Content>
        <ContentLogo>
          <Image
            source={theme.images.logo ? {uri: theme.images.logo} : logo}
            resizeMode="stretch"
          />
        </ContentLogo>

        <ContainerText>
          <Subtitle>{title()}</Subtitle>
        </ContainerText>
        <If condition={exclude}>
          <Input
            value={textReason}
            onChangeText={e => setTextReason(e)}
            placeholder={translate(
              'exclude.what_is_the_reason_for_deleting_your_account',
            )}
            placeholderTextColor={lighten(0.7, theme.colors.secondary)}
          />
        </If>
        <TextArea
          multiline
          value={message}
          placeholder={
            exclude
              ? translate(
                  'exclude.describe_the_reason_for_deleting_your_account',
                )
              : translate('contactUs.text_description')
          }
          placeholderTextColor={lighten(0.7, theme.colors.secondary)}
          onChangeText={e => setMessage(e)}
          style={{textAlignVertical: 'top', height: 300}}
        />
        <ViewButton>
          {/* <Button
            style={{
              backgroundColor: theme.colors.primary,
            }}
            mode="contained"
            onPress={() => console.log('Pressed')}
          >
            <Text>Enviar</Text>
          </Button> */}
          <ButtonSmall
            title={translate('contactUs.text_button_send')}
            onPress={postMessageContactUs}
            loading={loading}
          />
        </ViewButton>
      </Content>
    </Container>
  );
};
