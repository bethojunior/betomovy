import LottieView from 'lottie-react-native';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { AnimatedSource } from '../AppApresentation/constants';
import { styles } from './styles';
import { useTerms } from '../../../context/terms';

interface ApresentationScreenProps {
  itsNetwork: boolean;
  setModalTerms: (show: boolean) => void;
}

const ApresentationScreen = ({ itsNetwork, setModalTerms }: ApresentationScreenProps) => {
  const { termsAccepted } = useTerms();

  // Verificar termos ao montar o componente
  useEffect(() => {
    const checkTerms = async () => {
      setModalTerms(!termsAccepted);
    };

    checkTerms();
  }, [setModalTerms]);

  // Seleciona a animação de acordo com a disponibilidade de internet
  const chooseAnimated = useMemo(() => {
    return itsNetwork ? AnimatedSource.MOBILITY.uri : AnimatedSource.NO_CONNECTION.uri;
  }, [itsNetwork]);

  return (
    // Renderizo a animação na tela
    <View style={styles.container}>
      <LottieView
        source={chooseAnimated}
        autoPlay
        loop={false}
        resizeMode="contain"
        style={styles.animation}
      />
    </View>
  );
};

export default ApresentationScreen;
