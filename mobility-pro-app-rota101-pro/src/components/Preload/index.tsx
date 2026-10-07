import { ActivityIndicator, Platform } from 'react-native';
import {
  Container,
  Content,
  Splash,
  LogoImage,
  SplashImage,
  SpinnerContainer,
} from './styles';

import { Portal } from 'react-native-paper';
import logo from '~/../assets/logo.png';
import splash from '~/../assets/splash.png';

interface PreloadProps {
  visible: boolean;
  type?: 'brand' | 'spinner' | 'splash';
  transparent?: boolean;
}

const BrandDefault = () => (
  <Content>
    <LogoImage source={logo} />
  </Content>
);

const FullSplashImage = () => (
  <Splash>
    <SplashImage source={splash} />
  </Splash>
);

const Spinner = () => (
  <SpinnerContainer>
    <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 48} color="#fff" />
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
      <Container transparent={transparent}>
        {type === 'brand' && <BrandDefault />}
        {type === 'splash' && <FullSplashImage />}
        {type === 'spinner' && <Spinner />}
      </Container>
    </Portal>
  );
}
