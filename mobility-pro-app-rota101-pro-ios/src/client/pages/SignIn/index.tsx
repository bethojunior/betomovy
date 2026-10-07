// @ts-nocheck
import {AntDesign} from '@expo/vector-icons';
import banner from '../../assets/images/banner.jpg';
import logo from '../../../../assets/logo.png';
import OptionSignIn from '../../components/OptionSignIn';

import {translate} from '../../locales';
import {
  ButtonGuest,
  Container,
  Content,
  Image,
  ImageBackground,
  Label,
  TextButtonGuest,
  ViewGuest,
} from './styles';
import theme from '../../styles/theme';
import {useAuth} from '../../../context/auth';

export default function SignIn({navigation}) {
  const {setIsGuest} = useAuth();

  return (
    <Container>
      <ContentBackgroudImage />
      <Content>
        <Label>{translate('signin.text_start_using')}</Label>
        <OptionSignIn />
        <ButtonGuest onPress={() => setIsGuest(true)}>
          <ViewGuest>
            <TextButtonGuest>
              {translate('signin.text_continue_as_guest')}
            </TextButtonGuest>
            <AntDesign
              name="arrowright"
              size={21}
              color={theme.colors.secondary}
            />
          </ViewGuest>
        </ButtonGuest>
      </Content>
    </Container>
  );
}

function ContentBackgroudImage() {
  return (
    <ImageBackground resizeMode="cover" source={banner}>
      <Image
        source={theme.images.logo ? {uri: theme.images.logo} : logo}
        resizeMode="stretch"
      />
    </ImageBackground>
  );
}