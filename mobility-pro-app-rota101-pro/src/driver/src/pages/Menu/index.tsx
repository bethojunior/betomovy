import {
  Alert,
  Linking,
  Share,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  EvilIcons,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import * as Updates from 'expo-updates';
import Accordion from 'react-native-collapsible/Accordion';
import Constants from 'expo-constants';
import {
  BackGroundModal,
  ButtonSend,
  CarDetails,
  CloseModalButton,
  Container,
  ContainerModal,
  Content,
  DriverCodeContainer,
  EditProfileContainer,
  EmptySpace,
  HeaderContent,
  IconContent,
  InfoGrid,
  InfoCell,
  InfoCellLabel,
  InfoCellValue,
  VehicleInfoCell,
  VehicleInfoTextWrapper,
  VehicleInfoLine,
  VehicleInfoValue,
  RatingValueRow,
  NameContainer,
  PerfilContainer,
  ProfileButton,
  SimpleText,
  TextProfile,
  Title,
  TitleAcordion,
  VersionNumber,
  VersionNumberText,
} from './styles';
import ButtonWithIcon from '../../components/Buttons/WithIcon';
import { useAuth } from '../../../../context/auth';
import { translate } from '../../../../client/locales';
import { useUserDriver } from '../../context/userDriver';
import ButtonOptionCustom from '../../components/ButtonOptionCustom';
import { AdsProps } from '../../context/userDriver/types';
import { customToast } from '../../../../utils/FlashMessage';
import { useMenu } from '../../context/menu';
import { OptionsProps } from '../../context/menu/types';
import { If } from '../../components/If';
import Preload from '../../components/Preload';
import { useTripProvider } from '../../context/Trip';
import { useConfigLocal } from '../../context/ConfigLocal';
import { ModalConfigLocal } from '../../components/ModalConfigLocal';
import { buildApp, nameApp } from '../../../../constantBuild/config';
import { useModals } from '../../../../context/Modals';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { TouchableWithoutFeedback } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Helper from '../../utils/Helper';
import { LinkExternalActionType } from '../../../../constants/LinkExternal';
import { userIndicationService } from '../../../../client/contexts/userIndication/services';
import { AppsId } from '../../../../context/ConfigGlobal/constants';
import { storage } from '../../../../common/services/mmkv/storage';
import { useAlert } from '../../../../context/AlertProvider';
import InputPhoneCustom from '../../../../client/components/form/InputPhoneCustom';
import { TextInputProps } from 'react-native';
import theme from '../../styles/theme';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { useDriverAppReport } from '../../hooks/useDriverAppReport';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopyIcon } from '../../components/CopyIcon';

const CODE_TAXI = '3';

export default function Menu() {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { signOutDriver, generalSettings, cityConfig } = useAuth();
  const { userDriverFind, getLinkMenu, addAds } = useUserDriver();
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const setOff: any = useTripProvider((context: any) => context.setOff);
  const cancel: any = useTripProvider((context: any) => context.cancel);
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const cancelTrip: any = useTripProvider(
    (context: any) => context.stateTrip.cancelTrip,
  );
  const { getMenuOptions, setOptionsMenu, optionsMenu } = useMenu();
  const { colors } = useTheme();
  const { visibleMenu, setVisibleMenu } = useModals();
  const { itsNetwork } = useNetwork();
  const { states, setStates } = useConfigLocal();
  const { visibleConfigHidden } = states;
  const [linkMenu, setLinkMenu] = useState<AdsProps>({} as AdsProps);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const timer = useRef(null);
  const { getItem } = storage;
  const { showAlert } = useAlert();
  const phoneRef = useRef({} as TextInputProps);


  const { getStoragePictureSpecific } = useStoragePictures();
  const { sendReport: sendAppReport, loading: sendingAppReport } =
    useDriverAppReport();

  const width = useSharedValue(-500);

  const animationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: width.value }],
  }));

  const closeModal = () => {
    width.value = withTiming(-500, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
    setTimeout(() => {
      setVisibleMenu(false);
    }, 500);
  };

  const handleClickTimes = () => {
    if (clickCount >= 2) {
      // Se três cliques forem detectados, limpe o contador e o timer
      clearTimeout(timer.current);
      setClickCount(0);

      // Insira aqui a função que você deseja executar para um triplo clique
      setStates({
        ...states,
        visibleConfigHidden: true,
      });
    } else {
      // Incrementa o contador de cliques
      setClickCount(prevCount => prevCount + 1);

      // Define um timer para limpar o contador depois de um determinado tempo (ex: 250ms)
      timer.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

  const onInitMenu = async () => {
    if (optionsMenu.length > 0) {
      return;
    }
    const response = await getMenuOptions();

    if (response) {
      setOptionsMenu(response);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      customToast(translate('menu.text_copy_error'), 'danger');
    }
  };

  const onShare = async (onlyLink = false) => {
    try {
      const { data } = await userIndicationService.sharing({
        userId: userDriverFind?.idUser,
        phone: phoneRef?.current?.value || null,
        appId: Number(AppsId['CLIENTE FINAL']),
        formOfSharing: 'whatsapp',
        location: {
          latitude: getItem('lastPositionSync', 'json')?.coords?.latitude || 0,
          longitude:
            getItem('lastPositionSync', 'json')?.coords?.longitude || 0,
        },
      });
      if (phoneRef.current?.value && !onlyLink) {
        let number = phoneRef.current?.value?.replace(/\D/g, '');
        if (!number.startsWith('55')) {
          number = '55' + number;
        }
        if (phoneRef?.current?.value) phoneRef.current.value = '';
        Linking.openURL(`https://wa.me/${number}/?text=${data?.data?.message}`);
        return;
      }
      const result = await Share.share({
        message: `${data?.data?.message}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  const onShareDriver = async (onlyLink = false) => {
    try {
      const { data } = await userIndicationService.sharing({
        userId: userDriverFind?.idUser,
        phone: phoneRef.current?.value || null,
        appId: Number(AppsId.DRIVER),
        formOfSharing: 'whatsapp',
        location: {
          latitude: getItem('lastPositionSync', 'json')?.coords?.latitude || 0,
          longitude:
            getItem('lastPositionSync', 'json')?.coords?.longitude || 0,
        },
      });
      if (phoneRef.current.value && !onlyLink) {
        let number = phoneRef.current?.value?.replace(/\D/g, '');
        if (!number.startsWith('55')) {
          number = '55' + number;
        }
        if (phoneRef?.current?.value) phoneRef.current.value = '';
        Linking.openURL(`https://wa.me/${number}/?text=${data?.data?.message}`);
        return;
      }
      const result = await Share.share({
        message: `${data?.data?.message}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  const onNavLink = async () => {
    try {
      const url = linkMenu.link;
      Linking.openURL(url);
    } catch (error) {
      customToast(translate('toast.text_navigation_error'), 'danger');
    }
  };

  const onLink = async () => {
    const response = await getLinkMenu();
    if (response) {
      setLinkMenu(response);
    }
  };

  const verifyOptions = (options: OptionsProps[], key: string) => {
    if (options.length === 0) {
      return false;
    }

    const find = options.find(item => item.key === key);

    if (find.value === '1') {
      return true;
    }

    return false;
  };

  function createCodeFavorite() {
    const name = removeAcento(userDriverFind?.nickname)?.split('');

    const type = userDriverFind?.userTypeId === CODE_TAXI ? 'T' : 'P';

    const characters = `${name[0].toUpperCase()}${name[
      name.length - 1
    ].toUpperCase()}`;

    const code = `${`00000${userDriverFind.idDriver}`.slice(-5)}`;

    return `${characters}${code}${type}`;
  }

  function removeAcento(text: string) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
  }

  const onNavLinkWPP = async () => {
    try {
      const url = `https://wa.me/55${cityConfig?.supportContactNumber}/`;
      Linking.openURL(url);
    } catch (error) {
      customToast(translate('toast.text_navigation_error'), 'danger');
    }
  };

  useEffect(() => {
    // onInitMenu();
    onLink();
    onInitMenu();
    setLoading(false);
  }, []);

  const handlePress = onShareApp => {
    closeModal();
    showAlert(
      'Compartilhar Aplicativo',
      '',
      null,
      null,
      <>
        <Title>Informe o número do WhatsApp</Title>
        <InputPhoneCustom
          inputProps={{ autoFocus: true, ref: phoneRef }}
          onChangeValue={text => {
            if (phoneRef.current) {
              phoneRef.current.value = text;
            }
          }}
        />
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Title
              style={{
                marginLeft: undefined,
                fontSize: 22,
                color: theme.colors.secondary,
              }}
            >
              Indicação por Link
            </Title>

            <Ionicons
              name="share"
              color={theme.colors.primary}
              size={20}
              onPress={() => onShareApp(true)}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ButtonSend onPress={() => onShareApp()}>
              <Title
                style={{
                  marginLeft: undefined,
                  color: '#FFFFFF',
                }}
              >
                Enviar
              </Title>
            </ButtonSend>
          </View>
        </View>
      </>,
      true,
    );
  };

  const sections = [
    {
      id: 0,
      title: translate('menu.text_indications'),
      content: (
        <View>
          <If condition={verifyOptions(optionsMenu, 'driver_indications')}>
            <TouchableOpacity onPress={() => navigate('ListIndicator')}>
              <SimpleText>{translate('menu.my_indications')}</SimpleText>
            </TouchableOpacity>
          </If>
          <If condition={verifyOptions(optionsMenu, 'driver_indicate_driver')}>
            <TouchableOpacity
              onPress={() => handlePress(onlyLink => onShareDriver(onlyLink))}
            >
              <SimpleText>{translate('menu.share_app_driver')}</SimpleText>
            </TouchableOpacity>
          </If>
          <If condition={verifyOptions(optionsMenu, 'driver_indicate_client')}>
            <TouchableOpacity
              onPress={() => handlePress(onlyLink => onShare(onlyLink))}
            >
              <SimpleText>{translate('menu.share_app')}</SimpleText>
            </TouchableOpacity>
          </If>
        </View>
      ),
      icon: <FontAwesome size={20} color={colors.secondary} name="users" />,
    },
    {
      id: 1,
      title: translate('menu.text_config'),
      content: (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigate('Languages');
            }}
          >
            <SimpleText>{translate('language.title')}</SimpleText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate('Vehicle');
            }}
          >
            <SimpleText>{translate('menu.text_vehicle')}</SimpleText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onNavLinkWPP();
            }}
          >
            <SimpleText>{translate('menu.text_problem')}</SimpleText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate('Config');
            }}
          >
            <SimpleText>{translate('menu.app_options')}</SimpleText>
          </TouchableOpacity>
        </View>
      ),
      icon: <EvilIcons size={20} color={colors.secondary} name="gear" />,
    },
  ];

  const sectionHeader = section => {
    return (
      <HeaderContent>
        <IconContent>{section.icon}</IconContent>
        <Title>{section.title}</Title>
        <FontAwesome5
          name={
            activeSection[0] === section.id ? 'chevron-down' : 'chevron-right'
          }
          size={13}
          style={{
            position: 'absolute',
            right: 15,
            color: colors.secondary,
          }}
        />
      </HeaderContent>
    );
  };

  const sectionContent = section => {
    return <TitleAcordion>{section.content}</TitleAcordion>;
  };

  const cancelTripByDriver = async (generateCancellationFee = true) => {
    cancelTrip.tripReference = tripAccepted.tripReference;
    cancelTrip.generateCancellationFee = generateCancellationFee;
    cancelTrip.driverId = Number(userDriverFind.idDriver);
    await dispatchTrip({ type: 'update', field: 'cancelTrip', arg: cancelTrip });

    await cancel(false);
  };

  const logoutDriver = async () => {
    await setOff();
    signOutDriver();
  };

  const signOut = async () => {
    if (Object.keys(tripAccepted).length > 0) {
      Alert.alert(
        translate('menu.text_warning'),
        translate('menu.text_warning_message'),
        [
          {
            text: translate('tripDriver.cancel'),
            style: 'cancel',
          },
          {
            text: translate('tripDriver.text_confirm'),
            onPress: async () => {
              await cancelTripByDriver().then(async () => {
                logoutDriver();
              });
            },
          },
        ],
        { cancelable: false },
      );
      return;
    }
    logoutDriver();
  };

  const getFirstName = (name: string) => {
    if (!name) return '';
    let splitName = name?.split(' ');

    if (splitName.length > 0) {
      return splitName[0];
    }
  };

  useEffect(() => {
    width.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  const handleSendAppInfo = async () => {
    const { success } = await sendAppReport({
      driverId: Number(userDriverFind.idDriver),
      userId: Number(userDriverFind.userId),
      nickname: userDriverFind.nickname,
    });

    showAlert(
      translate(success ? 'home.status_success' : 'home.status_error'),
      translate(
        success
          ? 'home.message_report_app_success'
          : 'home.message_report_app_error',
      ),
    );
  };

  const handleAppInfo = () => {
    closeModal();
    showAlert(
      translate('home.title_report_informations_app'),
      translate('home.text_modal_report_informations_app'),
      null,
      null,
      <View style={{ marginTop: 10 }}>
        <ButtonSend onPress={handleSendAppInfo}>
          <Title style={{ marginLeft: undefined, color: '#FFFFFF' }}>
            {translate('home.text_confirm')}
          </Title>
        </ButtonSend>
      </View>,
      true,
    );
  };

  const clickLinkExternal = idMenuAction => {
    if (linkMenu.id !== '') {
      addAds(linkMenu.id);
    }
    if (!idMenuAction) {
      return onNavLink();
    }
    const publicity = {
      banner: linkMenu?.linkImage,
      description: linkMenu?.textImage,
      link: linkMenu?.link,
      typeAction: idMenuAction,
      buttonCta: linkMenu?.buttonCta || null,
      buttonsActions: linkMenu?.buttonsActions || null,
      id: linkMenu?.id,
    };
    switch (Number(idMenuAction)) {
      case LinkExternalActionType.ONLY_NAVIGATION:
        onNavLink();
        break;
      case LinkExternalActionType.OPEN_WEBVIEW:
        navigate('Publicity', {
          publicity,
        });
        break;
      case LinkExternalActionType.OPEN_INTERACT_IMAGE:
        navigate('Publicity', {
          publicity,
        });
        break;
    }
  };

  return (
    <Modal transparent={true} visible={visibleMenu}>
      <SafeAreaView>
        <BackGroundModal style={animationStyle}>
          <ContainerModal>
            <Preload visible={loading || sendingAppReport} />
            <Container>
              <If condition={verifyOptions(optionsMenu, 'driver_profile')}>
                <PerfilContainer>
                  <EditProfileContainer>
                    <ProfileButton
                      style={{ opacity: itsNetwork ? 1 : 0.4 }}
                      disabled={!itsNetwork}
                      onPress={() => {
                        navigate('Profile');
                      }}
                    >
                      <Avatar
                        containerStyle={{
                          borderWidth: 1,
                          borderColor: colors.primaryText,
                          elevation: 15,
                        }}
                        size="medium"
                        rounded
                        source={
                          userDriverFind != null && {
                            uri: `${getStoragePictureSpecific('driver') ||
                              buildApp().HOST_IMAGE_DRIVER
                              }${userDriverFind.profileImage}`,
                          }
                        }
                      />
                      <NameContainer>
                        <TextProfile style={{ fontWeight: 'bold', fontSize: 15 }}>
                          {translate('home.text_hello')}{' '}
                          {userDriverFind != null &&
                            getFirstName(userDriverFind?.name)}
                        </TextProfile>
                        <TextProfile style={{ fontSize: 13 }}>
                          {translate('menu.text_edit_profile')}
                        </TextProfile>
                      </NameContainer>
                    </ProfileButton>
                    <CloseModalButton onPress={closeModal}>
                      <MaterialIcons
                        size={25}
                        color={colors.primaryText}
                        name="arrow-back-ios"
                      />
                    </CloseModalButton>
                  </EditProfileContainer>

                  <CarDetails>
                    <TouchableOpacity
                      onPress={() => {
                        const code = createCodeFavorite();
                        copyToClipboard(code);
                      }}
                      activeOpacity={0.7}
                    >
                      <DriverCodeContainer>
                        <FontAwesome5
                          name="user-alt"
                          size={RFValue(10)}
                          color={colors.secondary}
                        />
                        <InfoCellLabel>
                          {translate('legend_button_profile.text_your_code')}
                        </InfoCellLabel>
                        <InfoCellValue>{createCodeFavorite()}</InfoCellValue>
                        <CopyIcon size={13} color={colors.secondary} />
                      </DriverCodeContainer>
                    </TouchableOpacity>
                    <InfoGrid>
                      <InfoCell>
                        <FontAwesome5
                          name="id-card"
                          size={RFValue(10)}
                          color={colors.secondary}
                        />
                        <InfoCellLabel>
                          {translate('legend_button_profile.text_plate')}
                        </InfoCellLabel>
                        <InfoCellValue>{userDriverFind?.car?.plate}</InfoCellValue>
                      </InfoCell>
                    </InfoGrid>
                    <InfoGrid>
                      <VehicleInfoCell>
                        <FontAwesome5
                          name="car-side"
                          size={RFValue(10)}
                          color={colors.secondary}
                        />
                        <VehicleInfoTextWrapper>
                          <VehicleInfoLine numberOfLines={2} ellipsizeMode="tail">
                            <InfoCellLabel>
                              {translate('legend_button_profile.text_car')}{' '}
                            </InfoCellLabel>
                            <VehicleInfoValue>
                              {[userDriverFind?.car?.brand, userDriverFind?.car?.model]
                                .filter(Boolean)
                                .join(' - ')}
                            </VehicleInfoValue>
                          </VehicleInfoLine>
                        </VehicleInfoTextWrapper>
                      </VehicleInfoCell>
                    </InfoGrid>
                    <InfoGrid>
                      <InfoCell>
                        <InfoCellLabel>
                          {translate('legend_button_profile.text_trips')}
                        </InfoCellLabel>
                        <InfoCellValue>
                          {userDriverFind?.total_finished_trip || 0}
                        </InfoCellValue>
                      </InfoCell>
                      <InfoCell>
                        <InfoCellLabel>
                          {translate('legend_button_profile.text_avaliation')}
                        </InfoCellLabel>
                        <RatingValueRow>
                          <InfoCellValue>{userDriverFind?.rating}</InfoCellValue>
                          <FontAwesome5
                            name="star"
                            size={RFValue(10)}
                            color={theme.colors.yellowStrong}
                            solid
                          />
                        </RatingValueRow>
                      </InfoCell>
                    </InfoGrid>
                  </CarDetails>
                </PerfilContainer>
              </If>

              <Content>
                <If
                  condition={Helper.generalSettingsActive(
                    generalSettings,
                    'enable_feature_button'
                  )}
                >
                  <ButtonWithIcon
                    title={translate('home.title_new_content_app')}
                    icon={
                      <Entypo size={20} color={colors.secondary} name="new" />
                    }
                    onPress={() => Linking.openURL(`https://webpague-layout.vercel.app/?app=${nameApp}&valor=200`)}
                  />
                </If>
                <ButtonWithIcon
                  title={translate('home.title_report_informations_app')}
                  icon={
                    <Entypo size={20} color={colors.secondary} name="warning" />
                  }
                  onPress={handleAppInfo}
                />
                <If condition={verifyOptions(optionsMenu, 'driver_races')}>
                  <ButtonWithIcon
                    title={translate('menu.text_my_trips')}
                    icon={
                      <FontAwesome5
                        size={20}
                        color={colors.secondary}
                        name="map-marked-alt"
                      />
                    }
                    onPress={() => {
                      navigate('MyTrips');
                    }}
                  />
                </If>

                <If condition={userDriverFind?.isDeliveryMan === '1'}>
                  <ButtonWithIcon
                    title={'Lista de entregas'}
                    icon={
                      <FontAwesome5
                        size={20}
                        color={colors.secondary}
                        name="map-marked-alt"
                      />
                    }
                    onPress={() => {
                      navigate('ListDelivery');
                    }}
                  />
                </If>

                <If condition={verifyOptions(optionsMenu, 'driver_dynamic')}>
                  <ButtonWithIcon
                    title={translate('menu.text_dynamic_zone')}
                    icon={
                      <Ionicons
                        size={20}
                        color={colors.secondary}
                        name="trending-up-outline"
                      />
                    }
                    onPress={() => {
                      navigate('ZoneDynamic');
                    }}
                  />
                </If>
                <If
                  condition={Helper.generalSettingsActive(
                    generalSettings,
                    'enable_favorite_customer_and_driver',
                  )}
                >
                  <ButtonWithIcon
                    title={translate('menu.text_client')}
                    icon={
                      <FontAwesome5
                        size={20}
                        color={colors.secondary}
                        name="user-friends"
                      />
                    }
                    onPress={() => {
                      navigate('ListClient');
                    }}
                  />
                </If>

                <If condition={verifyOptions(optionsMenu, 'driver_account')}>
                  <ButtonWithIcon
                    title={translate('menu.text_account_bank')}
                    icon={
                      <MaterialCommunityIcons
                        size={30}
                        color={colors.secondary}
                        name="bank-transfer"
                      />
                    }
                    onPress={() => {
                      navigate('Account');
                    }}
                  />
                </If>

                <ButtonWithIcon
                  title={translate('menu.text_routes')}
                  icon={
                    <FontAwesome5
                      size={20}
                      color={colors.secondary}
                      name="route"
                    />
                  }
                  onPress={() => {
                    navigate('Routes');
                  }}
                />

                <ButtonWithIcon
                  title={'Botão teste de pânico'}
                  icon={
                    <MaterialCommunityIcons
                      size={20}
                      color={colors.secondary}
                      name="camera"
                    />
                  }
                  onPress={() => {
                    navigate('ButtonTestPanic');
                  }}
                />

                <If condition={verifyOptions(optionsMenu, 'driver_prepaid')}>
                  <ButtonWithIcon
                    title={translate('menu.text_pre_paid')}
                    icon={
                      <FontAwesome5
                        size={20}
                        color={colors.secondary}
                        name="money-bill-wave"
                      />
                    }
                    onPress={() => {
                      navigate('Prepaid');
                    }}
                  />
                </If>

                <ButtonWithIcon
                  title={translate('menu.tempo_ao_volante')}
                  icon={
                    <MaterialIcons
                      size={20}
                      color={colors.secondary}
                      name="directions-car"
                    />
                  }
                  onPress={() => {
                    navigate('TempoAoVolante');
                  }}
                />

                <ButtonWithIcon
                  title={translate('menu.qrcode_fiscalizacao')}
                  icon={
                    <MaterialIcons
                      size={20}
                      color={colors.secondary}
                      name="qr-code"
                    />
                  }
                  onPress={() => {
                    navigate('QRCodeFiscalizacao');
                  }}
                />

                <If
                  condition={
                    verifyOptions(optionsMenu, 'driver_link_ads') &&
                    Object.keys(linkMenu).length > 0
                  }
                >
                  <ButtonOptionCustom
                    title={linkMenu?.description}
                    icon={
                      <EvilIcons
                        size={25}
                        name="external-link"
                        color={colors.secondary}
                      />
                    }
                    onPress={() => clickLinkExternal(linkMenu?.menuAppTypeAction)}
                  />
                </If>

                <Accordion
                  activeSections={activeSection}
                  sections={sections}
                  renderHeader={sectionHeader}
                  renderContent={sectionContent}
                  onChange={e => setActiveSection(e)}
                />


                {__DEV__ && (
                  <ButtonWithIcon
                    title="Desenvolvedor"
                    icon={
                      <MaterialIcons
                        size={20}
                        color={colors.secondary}
                        name="developer-mode"
                      />
                    }
                    onPress={() => navigate('DevMenu')}
                  />
                )}

                <ButtonWithIcon
                  title={translate('menu.text_logout')}
                  icon={
                    <AntDesign size={20} color={colors.secondary} name="logout" />
                  }
                  onPress={signOut}
                />
              </Content>
              <VersionNumber activeOpacity={1} onPress={handleClickTimes}>
                <VersionNumberText>
                  {Constants.expoConfig.version ??
                    userDriverFind?.appVersion?.version}
                </VersionNumberText>
              </VersionNumber>
            </Container>

            <If condition={visibleConfigHidden}>
              <ModalConfigLocal />
            </If>
          </ContainerModal>
          <TouchableWithoutFeedback onPress={closeModal}>
            <EmptySpace></EmptySpace>
          </TouchableWithoutFeedback>
        </BackGroundModal>
      </SafeAreaView>
    </Modal>
  );
}
