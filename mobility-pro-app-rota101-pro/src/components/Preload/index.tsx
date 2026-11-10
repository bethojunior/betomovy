import { ActivityIndicator, Image, Platform, StyleSheet, View } from 'react-native';
import { Container, Splash, SplashImage, SpinnerContainer } from './styles';

import { Portal } from 'react-native-paper';
import logoMovyWhite from '~/../assets/logo_movy_white_text.png';
import splash from '~/../assets/splash.png';

interface PreloadProps {
  visible: boolean;
  type?: 'brand' | 'spinner' | 'splash';
  transparent?: boolean;
}

const BrandDefault = () => {
  return (
    <View style={brand.screen}>
      <Image
        source={logoMovyWhite}
        resizeMode="contain"
        style={brand.logo}
      />
    </View>
  );
};

const brand = StyleSheet.create({
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#CF227B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 70,
  },
});

const FullSplashImage = () => (
  <Splash style={{ backgroundColor: '#CF227B' }}>
    <SplashImage source={splash} resizeMode="cover" />
  </Splash>
);

const Spinner = () => (
  <SpinnerContainer>
    <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 48} color="#04F3FA" />
  </SpinnerContainer>
);

export default function Preload({
  visible,
  type = 'spinner',
  transparent = true,
}: PreloadProps) {
  if (!visible) return null;

  return (
    <Portal>
      <Container
        transparent={transparent}
        style={!transparent && type === 'brand' ? { backgroundColor: '#CF227B' } : undefined}
      >
        {type === 'brand' && <BrandDefault />}
        {type === 'splash' && <FullSplashImage />}
        {type === 'spinner' && <Spinner />}
      </Container>
    </Portal>
  );
}
