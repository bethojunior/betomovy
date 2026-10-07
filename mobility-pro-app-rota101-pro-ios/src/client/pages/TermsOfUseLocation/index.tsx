import {Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import {useState, useEffect} from 'react';

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

import pathWelcomeImage from '../../../../assets/logo.png';
import pathConcludedImage from '../../../../assets/logo.png';
import {useAuth} from '../../../context/auth';
import {useLocal} from '../../contexts/local';
import Preload from '../../components/Preload';
import {translate} from '../../locales';
import {CheckBox} from '../../components/CheckBox';
import {Modal, Platform} from 'react-native';
import {nameApp} from '../../../constantBuild/config';
import TermsBox from '../../components/TermsBox';
import apiMain from '../../api/apiMain';

import TermsCheckSpeedMob from '../SpeedMob/TermsCheckSpeedMob';

import {useModules} from '../../contexts/modules';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function TermsOfUseLocation({visible, setVisible}: Props) {
  const {init} = useModules();

  const {getPermissionLocal} = useAuth();
  const {setPosition} = useLocal();

  const [loading, setLoading] = useState<boolean>(false);
  const [localizationAceppted, setLocalizationAceppted] =
    useState<boolean>(false);

  const [checkTerms, setCheckTerms] = useState<boolean>(false);
  const [stepWelcomeSpeedMob, setStepWelcomeSpeedMob] = useState<number>(1);
  const [descriptionTerms, setDescriptionTerms] = useState<string>('');

  const handleCheckTerms = () => {
    if (checkTerms) {
      setCheckTerms(false);
    } else {
      setCheckTerms(true);
    }
  };

  const handleRedirectLogin = async () => {
    await AsyncStorage.setItem('@mobility:AcceptTerms', 'true');
    setVisible(false);
  };

  const getLocation = async () => {
    setLoading(true);
    getPermissionLocal().then(() => {
      Location.getLastKnownPositionAsync()
        .then(location => {
          setLoading(false);
          if (location) {
            setPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          } else {
            setLoading(false);
            Location.getCurrentPositionAsync({accuracy: 1}).then(({coords}) => {
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
    const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
    const {status} = await MediaLibrary.requestPermissionsAsync();
    await Camera.requestCameraPermissionsAsync();
    await Camera.requestMicrophonePermissionsAsync();

    if (status !== 'granted') {
      return Camera.requestCameraPermissionsAsync();
    }

    permissions.gallery = true;
    await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
  };

  const getTextTerms = async () => {
    setLoading(true);
    try {
      const responseTerms = await apiMain.get(
        'termsUsePolicy/findByType?type=customer',
      );
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
    getTextTerms();
  }, []);

  useEffect(() => {
    if (stepWelcomeSpeedMob === 2 && Platform.OS === 'ios') {
      setLocalizationAceppted(true);
      handleNextSpeedMob();
    }
    (async () => {
      if (stepWelcomeSpeedMob === 3 && localizationAceppted) {
        await getLocation();
      }
    })();
  }, [stepWelcomeSpeedMob]);

  const acepptLocalization = localizationAceppted === true;
  return (
    <>
      <Modal
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        {init !== 'Speedmob' && (
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
                    <TermsBox contentTerms={descriptionTerms} />
                  )}
                  <CheckBox
                    colorText="#000000"
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
                      {translate(
                        'welcomeSpeedmob.description_localization_1',
                      )?.replace('SpeedMob', nameApp)}
                    </DescriptionLocalizationSpeedMob>
                    <DescriptionLocalizationSpeedMob>
                      {translate('welcomeSpeedmob.description_localization_2')}
                    </DescriptionLocalizationSpeedMob>
                    <ContentButtonsLocalizationSpeedMob>
                      <ButtonLocalizationSpeedMob
                        refuse={true}
                        onPress={() => {
                          setLocalizationAceppted(true);
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
                        {translate('welcomeSpeedmob.text_button_next')}
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
                      acepptLocalization
                        ? handleRedirectLogin()
                        : handleNextSpeedMob()
                    }
                  >
                    <TextButtonTermsSpeedMob>
                      {acepptLocalization
                        ? translate('welcomeSpeedmob.text_button_finalize')
                        : translate('welcomeSpeedmob.text_button_next')}
                    </TextButtonTermsSpeedMob>
                  </ButtonNextTermsSpeedMob>
                </>
              )}
            </ContentSpeedMob>
          </Container>
        )}
        {init === 'Speedmob' && <TermsCheckSpeedMob setVisible={setVisible} />}
      </Modal>
    </>
  );
}
