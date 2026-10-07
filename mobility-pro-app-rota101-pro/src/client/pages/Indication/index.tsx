import { useEffect, useState } from 'react';
import { Text, View, ScrollView, ImageSourcePropType, Share } from 'react-native';
import Preload from '../../components/Preload';
import IconSad from '../../assets/images/sad.png';
import WaveTop from '../../assets/images/wave-top.svg';
import WaveDown from '../../assets/images/wave-down.svg';
import iconTest2 from '../../assets/images/perfil-de-usuario.png';
import { UseUserIndication } from '../../contexts/userIndication';
import {
  ButtonIndication,
  ButtonShowMore,
  Card,
  Content,
  ContentCard,
  ContentEmpty,
  ContentInfo,
  Header,
  Icon,
  ImageCard,
  Name,
  Section,
  SimpleText,
  Title,
  TitleButton,
  TypeIndication,
} from './styles';
import { translate } from '../../locales';
import { usePaymentForm } from '../../contexts/paymentForms';
import { useAuth } from '../../../context/auth';
import { buildApp } from '../../../constantBuild/config';
import theme from '../../styles/theme';
import { userIndicationService } from '../../contexts/userIndication/services';
import { AppsId } from '../../../context/ConfigGlobal/constants';
import { useLocal } from '../../contexts/local';
import { customToast } from '../../../utils/FlashMessage';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';

interface ArrayIndication extends Array<ListIndication> { }
interface ListIndication {
  userIndicatedId: number;
  profileImage: ImageSourcePropType;
  indicated_nickname: string;
  cityName: string;
  created_at: string;
  indicated_type: string;
  driverStatus: string;
}
interface Details {
  label: string;
  userIndications: string;
}

let page = 1;

const IndicationPage = () => {
  const [indicationEmpty, setIndicationEmpty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [listIndication, setListIndication] = useState<ArrayIndication>([]);
  const [details, setDetails] = useState<any>();

  const { position } = useLocal();
  const { getIndication } = UseUserIndication();
  const { getCurrentBalanceVoucher } = usePaymentForm();
  const { generalSettings, user } = useAuth();
  const { getStoragePictureSpecific } = useStoragePictures();

  const loadIndication = async () => {
    setLoading(true);

    const { data } = await getIndication(page);
    setLoading(false);

    if (data.nextPage !== 0) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }

    if (data.data.length === 0) {
      setListIndication([]);
      return setIndicationEmpty(true);
    }

    setIndicationEmpty(false);
    return setListIndication([...listIndication, ...data.data]);
  };

  const getDetails = async () => {
    const data = await getCurrentBalanceVoucher();
    setDetails(data.referralMonetization);
  };

  useEffect(() => {
    setLoading(true);
    loadIndication();
    getDetails();
    setLoading(false);
  }, []);

  const formatDate = (data: string) => {
    const t1 = data?.split('-');
    return `${t1[1]}/${t1[0]}`;
  };

  const onShare = async () => {
    try {
      const { data } = await userIndicationService.sharing({
        userId: user.idUser,
        phone: null,
        appId: Number(AppsId['CLIENTE FINAL']),
        formOfSharing: 'whatsapp',
        location: {
          latitude: position?.latitude || 0,
          longitude: position?.longitude || 0,
        },
      });
      const result = await Share.share({
        message: `${data?.data?.message}`,
      });
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  // Evita exibição de dados incorretos na tela 
  if (indicationEmpty == null) return null;

  return (
    <View>
      <Preload visible={loading} />
      <Content>
        {indicationEmpty ? (
          <ContentEmpty>
            <View>
              <SimpleText>{translate('indicator.not_indicators')}</SimpleText>
              <Icon source={IconSad} />
              <ButtonIndication onPress={onShare}>
                <TitleButton>
                  {translate('indicationPage.text_indicate_now')}
                </TitleButton>
              </ButtonIndication>
            </View>
          </ContentEmpty>
        ) : (
          <View style={{ height: '100%' }}>
            <Header>
              <Title>{translate('indicationPage.text_person_indicated')}</Title>
              <View style={{ alignSelf: 'flex-end' }}>
                <Section>
                  <SimpleText>
                    {translate('indicationPage.text_nivel')} -{' '}
                  </SimpleText>
                  <SimpleText style={{ fontWeight: 'bold' }}>
                    {details?.label}
                  </SimpleText>
                </Section>
                <Section>
                  <SimpleText>
                    {translate('indicationPage.text_indications')} -{' '}
                  </SimpleText>
                  <SimpleText style={{ fontWeight: 'bold' }}>
                    {details?.userIndications}
                  </SimpleText>
                </Section>
              </View>
            </Header>
            <ScrollView>
              <ContentCard>
                {listIndication.map((item: ListIndication) => {
                  return (
                    <Card key={item.userIndicatedId}>
                      <WaveTop style={{ width: '100%', height: 50 }} />
                      <ImageCard
                        source={
                          item.profileImage
                            ? {
                              uri:
                                item.driverStatus === null
                                  ? `${getStoragePictureSpecific('customer') ||
                                  buildApp().HOST_IMAGE_CUSTOMER
                                  }${item.profileImage}`
                                  : `${getStoragePictureSpecific('driver') ||
                                  buildApp().HOST_IMAGE_DRIVER
                                  }${item.profileImage}`,
                            }
                            : iconTest2
                        }
                      />
                      <ContentInfo>
                        <TypeIndication>{item.indicated_type}</TypeIndication>
                        <Name>{item.indicated_nickname}</Name>
                        <TypeIndication>
                          {item.cityName && `${item.cityName}, `}
                          {item.created_at && formatDate(item.created_at)}
                        </TypeIndication>
                      </ContentInfo>
                      <WaveDown style={{ width: '100%', height: 27 }} />
                    </Card>
                  );
                })}
              </ContentCard>
            </ScrollView>
            {showMore && (
              <ButtonShowMore
                onPress={() => {
                  page += 1;
                  loadIndication();
                }}
              >
                <Text style={{ color: theme.colors.primaryText }}>
                  {translate('indicationPage.text_show_more')}
                </Text>
              </ButtonShowMore>
            )}
          </View>
        )}
      </Content>
    </View>
  );
};

export default IndicationPage;
