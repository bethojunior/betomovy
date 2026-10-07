import ModalFrame from '../Modal/ModalFrame';
import { TextEdit } from '../TextEdit';
import SvgQRCode from 'react-native-qrcode-svg';
import {
  Header,
  Container,
  Footer,
  ButtonManual,
  ContainerQrCode,
  TitleHeader,
} from './styles';
import theme from '../../../../client/styles/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/auth';
import { useUserDriver } from '../../context/userDriver';
import { View } from 'react-native';
import { translate } from '../../../../client/locales';
import { useTripProvider } from '../../context/Trip';
import { useLocal } from '../../hooks/location';

interface Props {
  setVisible?: (value: boolean) => void;
  visible?: boolean;
  setVisibleManual?: (value: boolean) => void;
}

export const ModalDoorHandle = ({
  setVisible,
  visible,
  setVisibleManual,
}: Props) => {
  const {generalSettings} = useAuth();
  const {userDriverFind} = useUserDriver();
  const postPerOrigin: any = useTripProvider(
    (context: any) => context.postPerOrigin,
  );
  const {location} = useLocal();

  const [link, setLink] = useState<string>('');
  useEffect(() => {
    getLinkUrl();

    if (visible)
      postPerOrigin({
        latitude: location?.coords?.latitude || 0,
        longitude: location?.coords?.longitude || 0,
      });
  }, [visible]);
  const getLinkUrl = () => {
    const responseObject = generalSettings.find(
      item => item.key === 'link_driver_pre_register',
    );
    const response = `${responseObject?.value.replace(
      '{userId}',
      userDriverFind?.idDriver || '',
    )}`;
    setLink(response);
  };
  return (
    <ModalFrame
      visible={visible}
      onClose={() => setVisible(false)}
      setVisible={setVisible}
      hideConfirm
    >
      <Container>
        <Header>
          <TitleHeader>{translate('doorHandle.open_new_trip')}</TitleHeader>
        </Header>
        <ContainerQrCode>
          <SvgQRCode
            logo={{ uri: theme?.images?.logo }}
            value={link || 'https://teste.com'}
            size={RFValue(200)}
          />
        </ContainerQrCode>
        <Footer>
          <TextEdit color={theme.colors.secondary} size="small">
            {translate('doorHandle.text_description')}{' '}
          </TextEdit>
        </Footer>
        <View>
          <TextEdit
            size="small"
            change="uppercase"
            color={theme.colors.primary}
          >
            {translate('doorHandle.or')}
          </TextEdit>
        </View>
        <ButtonManual
          onPress={() => {
            setVisible(false);
            setVisibleManual(true);
          }}
        >
          <TextEdit
            size="small"
            change="uppercase"
            color={theme.colors.primary}
          >
            {translate('doorHandle.open_manuel_trip')}
          </TextEdit>
        </ButtonManual>
      </Container>
    </ModalFrame>
  );
};
