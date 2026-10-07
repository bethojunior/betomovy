import { useState } from 'react';
import {
  Container,
  ContainerText,
  Content,
  ContentLogo,
  Image,
  Subtitle,
  TextArea,
  ViewButton,
} from './styles';
import logo from '../../../../assets/logo.png';
import { ButtonSmall } from '../../components/ButtonSmall';
import { customToast } from '../../../utils/FlashMessage';
import Preload from '../../components/Preload';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';
import theme from '../../styles/theme';
import { lighten } from 'polished';
import { useContactUs } from './hooks';

export const ContactUs = ({ route }: any) => {
  const { postContactUs, insertByCustomer } = useContactUs();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    if (route?.params?.tripReference) {
      await insertByCustomer(
        message,
        route?.params?.tripReference,
        route?.params?.id || null,
      );
    } else {
      await postContactUs(message, user?.idUser);
    }

    setMessage('');
    setLoading(false);
  };

  return (
    <Container>
      <Preload visible={loading} />
      <Content>
        <ContentLogo>
          <Image
            source={theme.images.logo ? { uri: theme.images.logo } : logo}
            resizeMode="stretch"
          />
        </ContentLogo>

        <ContainerText>
          <Subtitle>{title()}</Subtitle>
        </ContainerText>

        <TextArea
          value={message}
          placeholder={translate('contactUs.text_description')}
          placeholderTextColor={lighten(0.7, theme.colors.secondary)}
          onChangeText={e => setMessage(e)}
        />
        <ViewButton>
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
