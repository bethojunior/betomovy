// @ts-nocheck
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { CheckBox } from '../../../components/CheckBox';
import TermsBox from '../../../components/TermsBox';
import Select from '../../../components/Select';
import Preload from '../../../components/Preload';

import apiMain from '../../../api/apiMain';
import apiMainDriver from '../../../../driver/src/api/apiMain';

import { translate } from '../../../locales';
import {
  Container,
  ContentSpeedMob,
  ImageSpeedMob,
  TextNoticeTermsSpeedMob,
  ButtonNextTermsSpeedMob,
  TextButtonTermsSpeedMob,
  ContentLocalizationSpeedMob,
  DescriptionLocalizationSpeedMob,
  TitleLocalizationSpeedMob,
  ContentButtonsLocalizationSpeedMob,
  ButtonLocalizationSpeedMob,
  TextOkPermissionConcluded,
  TitlePermissionsConcluded,
} from './styles';
import { useAuth } from '../../../../context/auth';
import { useLocal } from '../../../contexts/local';

import pathWelcomeImage from '../../../../../assets/welcome-speedmob.png';
import pathConcludedImage from '../../../../../assets/permission-concluded-speedmob.png';
import pathArchitetureImage from '../../../../../assets/architecture-and-city-speedmob.png';

import theme from '../../../styles/theme';
import { storage } from '../../../../common/services/mmkv/storage';
import { useTerms } from '../../../../context/terms';
import { useNavigation } from '@react-navigation/native';

interface FranchiseHostsProps {
  hostLink: string;
  hostName: string;
}

interface FranchiseAppProps {
  franchise_id: number;
  app_type_id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  logo: string;
}

interface FranchisesProps {
  franchiseHosts: FranchiseHostsProps[];
  franchiseApp: FranchiseAppProps[];
  franchise: {
    franchise_id: number;
    franchise_name: string;
  };
}

interface CitiesProps {
  id: number;
  name: string;
}

interface EstatesProps {
  id: number;
  name: string;
}

interface PositionUserProps {
  acurracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

export default function TermsCheckSpeedMob() {
  const { getPermissionLocal } = useAuth();
  const { position, setPosition } = useLocal();
  const { termsAccepted, acceptTerms } = useTerms();

  const [loading, setLoading] = useState<boolean>(false);
  const [localizationAceppted, setLocalizationAceppted] =
    useState<boolean>(false);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [positionUser, setPositionUser] = useState<PositionUserProps>();
  const [checkTerms, setCheckTerms] = useState<boolean>(false);
  const [stepWelcomeSpeedMob, setStepWelcomeSpeedMob] = useState<number>(1);
  const [listEstates, setListEstates] = useState<EstatesProps[]>([]);
  const [listCities, setListCities] = useState<CitiesProps[]>([]);
  const [listDataFranchises, setListDataFranchises] = useState<
    FranchisesProps[]
  >([]);
  const [franchiseSelected, setFranchiseSelected] = useState<FranchisesProps>();
  const [estateSelected, setEstateSelected] = useState<number | undefined>(
    undefined,
  );
  const [citySelected, setCitySelected] = useState<number | undefined>(
    undefined,
  );
  const [idFranchiseSelected, setIdFranchiseSelected] = useState<
    number | undefined
  >(undefined);

  const [descriptionTerms, setDescriptionTerms] = useState<string>('');

  const handleCheckTerms = () => {
    if (checkTerms) {
      setCheckTerms(false);
    } else {
      setCheckTerms(true);
    }
  };

  const handleRedirectLogin = async () => {
    setLoading(true);
    try {
      const { granted: permissionLocation } = await Location.getForegroundPermissionsAsync();

      if (!permissionLocation) {
        await getPermissionLocal().then(() => {
          Location.getLastKnownPositionAsync({ accuracy: 1 })
            .then(location => {
              setLoading(false);
              if (location) {
                setPositionUser(location.coords);
                setPosition({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
              } else {
                setLoading(false);
                Location.getCurrentPositionAsync({ accuracy: 1 }).then(({ coords }) => {
                  setPositionUser(location.coords);
                  setPosition({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  });
                });
              }
            })
            .catch(error => {
              setLoading(false);
              console.log(error);
            });
        });

        await getPerms();
      } else {
        if (listDataFranchises.length === 1) {
          const host = listDataFranchises[0].franchiseHosts.find(
            data => data.hostName === 'taxiReturnApi',
          );
          await AsyncStorage.setItem(
            '@speedmob:franchiseHosts',
            JSON.stringify(host.hostLink),
          );
          await AsyncStorage.setItem(
            '@speedmob:franchiseApp',
            JSON.stringify(listDataFranchises[0].franchiseApp),
          );

          apiMain.defaults.baseURL = host.hostLink;
          apiMainDriver.defaults.baseURL = host.hostLink;
        }

        if (franchiseSelected) {
          const host = franchiseSelected.franchiseHosts.find(
            data => data.hostName === 'taxiReturnApi',
          );
          await AsyncStorage.setItem(
            '@speedmob:franchiseHosts',
            JSON.stringify(host.hostLink),
          );
          await AsyncStorage.setItem(
            '@speedmob:franchiseApp',
            JSON.stringify(franchiseSelected.franchiseApp),
          );

          apiMain.defaults.baseURL = host.hostLink;
          apiMainDriver.defaults.baseURL = host.hostLink;
        }

        acceptTerms(true);
        setLoading(false);
        navigation.navigate('SignIn', { replace: true });
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };

  const getLocation = async () => {
    setLoading(true);
    getPermissionLocal().then(() => {
      Location.getLastKnownPositionAsync({ accuracy: 1 })
        .then(location => {
          setLoading(false);
          if (location) {
            setPositionUser(location.coords);
            setPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          } else {
            setLoading(false);
            Location.getCurrentPositionAsync({ accuracy: 1 }).then(({ coords }) => {
              setPositionUser(location.coords);
              setPosition({
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
            });
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    });
    setLoading(false);
  };

  const getPerms = async () => {
    await Camera.requestCameraPermissionsAsync();
    await Camera.requestMicrophonePermissionsAsync();
  };

  const getTextTerms = async () => {
    setLoading(true);
    try {
      const responseTerms = await apiMain.get('termsUsePolicy/findByType?type=partner');
      setDescriptionTerms(responseTerms.data.data.description);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleNextSpeedMob = async () => {
    if (stepWelcomeSpeedMob === 1) {
      await getPerms();
    }

    setStepWelcomeSpeedMob(stepWelcomeSpeedMob + 1);
  };

  useEffect(() => {
    const getEstates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://api.speedmob.com.br/list/States',
        );
        if (response.data.status) {
          setListEstates(response.data.data);
        }
      } catch (error) {
        console.log(error);
        alert(String(error));
      }
      setLoading(false);
    };

    getEstates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.speedmob.com.br/list/Cities?stateId=${estateSelected}`,
        );
        if (response.data.status) {
          setListCities(response.data.data);
        }
      } catch (error) {
        console.log(error);
        alert(String(error));
      }
      setLoading(false);
    };

    getCities();
  }, [estateSelected]);

  useEffect(() => {
    const getFranchises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.speedmob.com.br/login/AppByCityId?cityId=${citySelected}`,
        );
        if (response.data.status) {
          setListDataFranchises(response.data.data);

          {
            /* SE OS VALORES FOREM NULOS RESETA PARA OS VALORES INICIAIS */
          }
          if (response.data.data === null) {
            setIdFranchiseSelected(undefined);
            setFranchiseSelected(undefined);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getFranchises();
  }, [citySelected]);

  useEffect(() => {
    const getFranchises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.speedmob.com.br/login/App?lat=${positionUser.longitude}&lng=${positionUser.latitude}`,
        );
        if (response.data.status) {
          setListDataFranchises(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    if (positionUser) {
      getFranchises();
    }
  }, [positionUser]);

  useEffect(() => {
    getTextTerms();
  }, []);

  useEffect(() => {
    (async () => {
      if (stepWelcomeSpeedMob === 3 && localizationAceppted) {
        await getLocation();
      }
    })();
  }, [stepWelcomeSpeedMob]);

  useEffect(() => {
    {
      /* FILTRAGEM DA LISTA DE FRANQUIAS PELO ID SELECIONADO */
    }
    const datasFranchiseSelected = listDataFranchises?.find(
      data => data?.franchise?.franchise_id === idFranchiseSelected,
    );

    setFranchiseSelected(datasFranchiseSelected);
  }, [idFranchiseSelected]);

  useEffect(() => {
    const getConfigFranchiseSelected = async () => {
      try {
        if (franchiseSelected) {
          theme.colors.primary = franchiseSelected.franchiseApp[1].primary_color;
          theme.colors.background_global = franchiseSelected.franchiseApp[1].secondary_color;
          theme.colors.secondary = franchiseSelected.franchiseApp[1].text_color;
          theme.images.logo = franchiseSelected.franchiseApp[1].logo;
        }
      } catch (error) {
        console.log(error);
      }
    }

    getConfigFranchiseSelected();
  }, [franchiseSelected]);

  const isSelectCity = localizationAceppted === false || location === null;

  const acepptLocalization =
    localizationAceppted === true && listDataFranchises?.length > 0;
  return (
    <Container>
      <Preload visible={loading} />
      <ContentSpeedMob>
        {stepWelcomeSpeedMob === 1 && (
          <>
            <ImageSpeedMob source={pathWelcomeImage} />
            <TextNoticeTermsSpeedMob>
              {translate('welcomeSpeedmob.text_notice_terms')}
            </TextNoticeTermsSpeedMob>
            {descriptionTerms && (
              <TermsBox
                contentTerms={descriptionTerms}
              />
            )}
            <CheckBox
              checked={checkTerms}
              title={translate('welcomeSpeedmob.title_checkbox')}
              onCheck={handleCheckTerms}
            />
            <ButtonNextTermsSpeedMob
              disabled={!checkTerms}
              isDisabled={!checkTerms}
              onPress={handleNextSpeedMob}
            >
              <TextButtonTermsSpeedMob>
                {translate('welcomeSpeedmob.text_button_next')}
              </TextButtonTermsSpeedMob>
            </ButtonNextTermsSpeedMob>
          </>
        )}
        {stepWelcomeSpeedMob === 2 && (
          <>
            <ImageSpeedMob source={pathWelcomeImage} />
            <ContentLocalizationSpeedMob>
              <TitleLocalizationSpeedMob>
                {translate('welcomeSpeedmob.title_localization')}
              </TitleLocalizationSpeedMob>
              <DescriptionLocalizationSpeedMob>
                {translate('welcomeSpeedmob.description_localization_1')}
              </DescriptionLocalizationSpeedMob>
              <DescriptionLocalizationSpeedMob>
                {translate('welcomeSpeedmob.description_localization_2')}
              </DescriptionLocalizationSpeedMob>
              <ContentButtonsLocalizationSpeedMob>
                <ButtonLocalizationSpeedMob
                  refuse={true}
                  onPress={() => {
                    setLocalizationAceppted(false);
                    handleNextSpeedMob();
                  }}
                >
                  {translate('welcomeSpeedmob.text_button_refuse_terms')}
                </ButtonLocalizationSpeedMob>
                <ButtonLocalizationSpeedMob
                  onPress={() => {
                    setLocalizationAceppted(true);
                    handleNextSpeedMob();
                  }}
                >
                  {translate('welcomeSpeedmob.text_button_accept_terms')}
                </ButtonLocalizationSpeedMob>
              </ContentButtonsLocalizationSpeedMob>
            </ContentLocalizationSpeedMob>
          </>
        )}

        {stepWelcomeSpeedMob === 3 && (
          <>
            <TitlePermissionsConcluded>
              {translate('welcomeSpeedmob.title_permissions_concluded')}
            </TitlePermissionsConcluded>
            <TextOkPermissionConcluded>
              {translate('welcomeSpeedmob.text_permissions_concluded')}
            </TextOkPermissionConcluded>
            <ImageSpeedMob source={pathConcludedImage} />
            <ButtonNextTermsSpeedMob
              disabled={!checkTerms}
              isDisabled={!checkTerms}
              onPress={() =>
                listDataFranchises?.length === 1 && acepptLocalization
                  ? handleRedirectLogin()
                  : handleNextSpeedMob()
              }
            >
              <TextButtonTermsSpeedMob>
                {listDataFranchises?.length === 1 && acepptLocalization
                  ? translate('welcomeSpeedmob.text_button_finalize')
                  : translate('welcomeSpeedmob.text_button_next')}
              </TextButtonTermsSpeedMob>
            </ButtonNextTermsSpeedMob>
          </>
        )}

        {stepWelcomeSpeedMob === 4 && (
          <>
            <ImageSpeedMob source={pathArchitetureImage} />
            {isSelectCity && acepptLocalization === false && (
              <>
                <Select
                  label={translate('welcomeSpeedmob.select_label_state')}
                  valueInitial={translate(
                    'welcomeSpeedmob.select_label_state_placeholder',
                  )}
                  value={estateSelected}
                  setValue={setEstateSelected}
                  datasList={listEstates}
                />
                {listCities.length > 0 && (
                  <Select
                    label={translate('welcomeSpeedmob.select_label_city')}
                    valueInitial={translate(
                      'welcomeSpeedmob.select_label_city_placeholder',
                    )}
                    value={citySelected}
                    setValue={setCitySelected}
                    datasList={listCities}
                  />
                )}
              </>
            )}

            {listDataFranchises && listDataFranchises.length > 1 && (
              <Select
                valueInitial={translate(
                  'welcomeSpeedmob.seleact_label_franchise',
                )}
                label={translate(
                  'welcomeSpeedmob.select_label_franchise_placeholder',
                )}
                value={idFranchiseSelected}
                setValue={setIdFranchiseSelected}
                datasList={listDataFranchises}
                typeSelect="franchise"
              />
            )}
            <ButtonNextTermsSpeedMob
              disabled={
                franchiseSelected === undefined || franchiseSelected === ''
              }
              isDisabled={
                franchiseSelected === undefined || franchiseSelected === ''
              }
              onPress={handleRedirectLogin}
            >
              <TextButtonTermsSpeedMob>
                {translate('welcomeSpeedmob.text_button_finalize')}
              </TextButtonTermsSpeedMob>
            </ButtonNextTermsSpeedMob>
          </>
        )}
      </ContentSpeedMob>
    </Container>
  );
}
