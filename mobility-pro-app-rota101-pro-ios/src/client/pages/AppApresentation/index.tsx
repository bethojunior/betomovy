import {
  Container,
  TitleApresentation,
  DescriptionApresentation,
  ContentDotsLoading,
} from './styles';
import LottieView from 'lottie-react-native';
import {Modal} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useEffect, useState} from 'react';

import LoadingDots from '../../components/LoadingDots';

import {translate} from '../../locales';
import {useModules} from '../../contexts/modules';
import {useAuth} from '../../../context/auth';
import {AnimatedSource} from './constants';
import {RFValue} from 'react-native-responsive-fontsize';
import { useNetwork } from '../../../context/ConfigGlobal';
import { If } from '../../components/If';

interface ApresentationAppProps {
  setVisible: (data: boolean) => void;
  setModalTerms: (data: boolean) => void;
  visible: boolean;
}

export const ApresentationApp = ({
  setVisible,
  visible,
  setModalTerms,
}: ApresentationAppProps) => {
  const {init} = useModules();
  const {itsNetwork} = useNetwork();
  const {loading} = useAuth();

  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [chooseAnimated, setChooseAnimated] = useState(
    AnimatedSource.MOBILITY.uri,
  );

  useEffect(() => {
    if(!itsNetwork) {
      setChooseAnimated(AnimatedSource.NO_CONNECTION.uri)
    } else {
      setChooseAnimated(AnimatedSource.MOBILITY.uri)
    }
  },[itsNetwork])


  const verifyAccept = async () => {
    const response = await AsyncStorage.getItem('@mobility:AcceptTerms');
    if (!response) {
      setModalTerms(true);
      return;
    }
    setModalTerms(false);
  };

  const getAnimated = () => {
    switch (init) {
      case 'delivery':
        setChooseAnimated(AnimatedSource.DELIVERY.uri);
        break;
      case 'mobility':
        setChooseAnimated(AnimatedSource.MOBILITY.uri);
        break;
      case 'services':
        setChooseAnimated(AnimatedSource.SERVICES.uri);
        break;
      default:
        setChooseAnimated(AnimatedSource.MOBILITY.uri);
        break;
    }
  };

  useEffect(() => {
    if (!loading && init !== '') {
      setRoutesLoaded(true);
    }
  }, [loading, init]);

  const splashLoad = async () => {
    if (routesLoaded) {
      await verifyAccept();
      setVisible(false);
    }
  };

  useEffect(() => {
    splashLoad();
  }, [routesLoaded]);

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Container>
        <TitleApresentation
        color={
          !itsNetwork && 'red' 
        }
        >
          {itsNetwork ? translate('apresentation_app.title_apresentation') : translate('commom.your_connection_is_unstable_check_your_internet_connection')}
        </TitleApresentation>
        <LottieView
          autoPlay
          loop
          duration={2500}
          style={{
            width: RFValue(290),
            height: RFValue(290),
          }}
          source={
            chooseAnimated}
        />
        <If condition={itsNetwork}>

        <DescriptionApresentation>
          {translate('apresentation_app.text_loading')}
        </DescriptionApresentation>
        <ContentDotsLoading>
          <LoadingDots />
        </ContentDotsLoading>
        </If>

      </Container>
    </Modal>
  );
};
