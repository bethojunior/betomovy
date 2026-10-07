import {
  Alert,
  Linking,
  Share,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  EvilIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {useTheme} from 'styled-components';
import * as Updates from 'expo-updates';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {
  BackGroundModal,
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
  NameContainer,
  PerfilContainer,
  ProfileButton,
  SimpleText,
  TextProfile,
  Title,
  TitleAcordion,
  TitleDetails,
  VersionNumber,
  VersionNumberText,
} from './styles';
import ButtonWithIcon from '../../components/Buttons/WithIcon';
import {useAuth} from '../../../../context/auth';
import {translate} from '../../../../client/locales';
import {useUserDriver} from '../../context/userDriver';
import ButtonOptionCustom from '../../components/ButtonOptionCustom';
import {AdsProps} from '../../context/userDriver/types';
import {customToast} from '../../../../utils/FlashMessage';
import {useMenu} from '../../context/menu';
import {OptionsProps} from '../../context/menu/types';
import {If} from '../../components/If';
import Preload from '../../components/Preload';
import {useTripProvider} from '../../context/Trip';
import {useConfigLocal} from '../../context/ConfigLocal';
import {ModalConfigLocal} from '../../components/ModalConfigLocal';
import {buildApp} from '../../../../constantBuild/config';
import {useModals} from '../../../../context/Modals';
import {TouchableWithoutFeedback} from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Helper from '../../utils/Helper';

const CODE_TAXI = '3';

export default function Menu() {
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const {signOutDriver, generalSettings, cityConfig} = useAuth();
  const {userDriverFind, getLinkMenu, addAds} = useUserDriver();
  const {stateTrip, cancel, dispatchTrip, setOff} = useTripProvider();
  const {tripAccepted, cancelTrip} = stateTrip;
  const {getMenuOptions, setOptionsMenu, optionsMenu} = useMenu();
  const {colors} = useTheme();
  const {visibleMenu, setVisibleMenu} = useModals();
  const {states, setStates} = useConfigLocal();
  const {visibleConfigHidden} = states;
  const [linkMenu, setLinkMenu] = useState<AdsProps>({} as AdsProps);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const timer = useRef(null);

  const width = useSharedValue(-500);

  const animationStyle = useAnimatedStyle(() => ({
    transform: [{translateX: width.value}],
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${
          generalSettings.find(item => item.key === 'appSharingCustomerMessage')
            .value
        } ${generalSettings
          .find(item => item.key === 'link_customer_pre_register')
          .value.replace('{userId}', userDriverFind.userId)}`,
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
      customToast('Erro ao Compartilhar', 'danger');
    }
  };

  const onShareDriver = async () => {
    try {
      const result = await Share.share({
        message: `${
          generalSettings.find(item => item.key === 'appSharingCustomerMessage')
            .value
        } ${generalSettings
          .find(item => item.key === 'link_driver_pre_register')
          .value.replace('{userId}', userDriverFind.userId)}`,
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
      customToast('Erro ao Compartilhar', 'danger');
    }
  };

  const onNavLink = async () => {
    try {
      const url = linkMenu.link;

      if (linkMenu.id !== '') {
        addAds(linkMenu.id);
      }

      Linking.openURL(url);
    } catch (error) {
      customToast('Erro ao navegar', 'danger');
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
    const name = removeAcento(userDriverFind?.nickname).split('');

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
      customToast('Erro ao navegar', 'danger');
    }
  };

  useEffect(() => {
    // onInitMenu();
    onLink();
    onInitMenu();
    setLoading(false);
  }, []);

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
            <TouchableOpacity onPress={onShareDriver}>
              <SimpleText>{translate('menu.share_app_driver')}</SimpleText>
            </TouchableOpacity>
          </If>
          <If condition={verifyOptions(optionsMenu, 'driver_indicate_client')}>
            <TouchableOpacity onPress={onShare}>
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
    await dispatchTrip({type: 'update', field: 'cancelTrip', arg: cancelTrip});

    await cancel(false);
  };

  const logoutDriver = async () => {
    await setOff();
    Updates.reloadAsync();
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
        {cancelable: false},
      );
      return;
    }
    logoutDriver();
  };

  const getFirstName = (name: string) => {
    if (!name) return '';
    let splitName = name.split(' ');

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

  return (
    <Modal transparent={true} visible={visibleMenu}>
      <BackGroundModal style={animationStyle}>
        <ContainerModal>
          <Preload visible={loading} />
          <Container>
            <If condition={verifyOptions(optionsMenu, 'driver_profile')}>
              <PerfilContainer>
                <EditProfileContainer>
                  <ProfileButton
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
                          uri: `${buildApp().HOST_IMAGE_DRIVER}${
                            userDriverFind.profileImage
                          }`,
                        }
                      }
                    />
                    <NameContainer>
                      <TextProfile style={{fontWeight: 'bold', fontSize: 15}}>
                        {translate('home.text_hello')}{' '}
                        {userDriverFind != null &&
                          getFirstName(userDriverFind?.name)}
                      </TextProfile>
                      <TextProfile style={{fontSize: 13}}>
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
                  <DriverCodeContainer>
                    <TitleDetails>
                      {translate('legend_button_profile.text_your_code')}
                    </TitleDetails>
                    <Text>{createCodeFavorite()}</Text>
                  </DriverCodeContainer>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <TitleDetails>
                        {translate('legend_button_profile.text_trips')}
                      </TitleDetails>
                      <Text> {userDriverFind?.total_finished_trip || 0}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TitleDetails>
                        {translate('legend_button_profile.text_avaliation')}
                      </TitleDetails>
                      <Text> {userDriverFind?.rating}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TitleDetails>
                        {translate('legend_button_profile.text_car')}
                      </TitleDetails>
                      <Text>
                        {userDriverFind?.car?.model}-
                        {userDriverFind?.car?.plate}
                      </Text>
                    </View>
                  </View>
                </CarDetails>
              </PerfilContainer>
            </If>

            <Content>
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
                  onPress={onNavLink}
                />
              </If>

              <Accordion
                activeSections={activeSection}
                sections={sections}
                renderHeader={sectionHeader}
                renderContent={sectionContent}
                onChange={e => setActiveSection(e)}
              />

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
                {Constants.manifest.version ??
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
    </Modal>
  );
}
