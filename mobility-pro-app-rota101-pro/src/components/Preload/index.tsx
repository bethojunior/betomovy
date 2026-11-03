import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Container, Splash, SplashImage, SpinnerContainer } from './styles';

import { Portal } from 'react-native-paper';
import splashRingsBg from '~/../assets/splash_rings_bg.png';
import splashIconMovy from '~/../assets/splash_icon_movy.png';
import splashTextMovyWhite from '~/../assets/splash_text_movy_white.png';
import splash from '~/../assets/splash.png';

interface PreloadProps {
  visible: boolean;
  type?: 'brand' | 'spinner' | 'splash';
  transparent?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Proporções exatas da composição central da Logo Movy
const ICON_WIDTH = 68;
const ICON_HEIGHT = 54;
const GAP = 10;
const TEXT_WIDTH = 148;
const TEXT_HEIGHT = 46;
const TOTAL_WIDTH = ICON_WIDTH + GAP + TEXT_WIDTH; // 226
// Distância do centro do ícone (34) até o centro do container (113) = 79
const CENTER_OFFSET_X = (TOTAL_WIDTH / 2) - (ICON_WIDTH / 2);

const BrandDefault = () => {
  // Animação sincronizada 100% idêntica ao vídeo
  const iconFade = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.75)).current;
  const iconTranslateX = useRef(new Animated.Value(CENTER_OFFSET_X)).current;

  const textFade = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(18)).current;

  const pulseScale = useRef(new Animated.Value(0.85)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // 1. Pulso suave e contínuo das ondas concêntricas
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.4,
            duration: 1900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 0.85, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // 2. Animação do Logo:
    // Fase 1: Ícone surge no centro exato da tela com zoom e fade
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconFade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1.05,
          duration: 550,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      // Pausa idêntica ao vídeo
      Animated.delay(180),
      // Fase 2: Ícone desliza suavemente para a sua posição esquerda e o texto Movy branco surge ao lado
      Animated.parallel([
        Animated.timing(iconTranslateX, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={splashRingsBg}
      style={brand.screen}
      resizeMode="cover"
    >
      {/* Onda circular de pulso concêntrico */}
      <Animated.View
        style={[
          brand.pulseRing,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* Composição Central Perfeitamente Alinhada (Ícone + Texto Movy em Branco) */}
      <View style={brand.logoContainer}>
        {/* Ícone Movy colorido com deslocamento milimétrico */}
        <Animated.Image
          source={splashIconMovy}
          resizeMode="contain"
          style={[
            brand.icon,
            {
              opacity: iconFade,
              transform: [
                { scale: iconScale },
                { translateX: iconTranslateX },
              ],
            },
          ]}
        />

        {/* Texto Movy Branco idêntico ao vídeo, sem qualquer corte */}
        <Animated.Image
          source={splashTextMovyWhite}
          resizeMode="contain"
          style={[
            brand.textWhite,
            {
              opacity: textFade,
              transform: [{ translateX: textTranslateX }],
            },
          ]}
        />
      </View>
    </ImageBackground>
  );
};

const brand = StyleSheet.create({
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#CD2379',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.40)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: TOTAL_WIDTH,
    height: 70,
  },
  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  },
  textWhite: {
    width: TEXT_WIDTH,
    height: TEXT_HEIGHT,
    marginLeft: GAP,
  },
});

const FullSplashImage = () => (
  <Splash style={{ backgroundColor: '#CD2379' }}>
    <SplashImage source={splash} resizeMode="cover" />
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
      <Container
        transparent={transparent}
        style={!transparent && type === 'brand' ? { backgroundColor: '#CD2379' } : undefined}
      >
        {type === 'brand' && <BrandDefault />}
        {type === 'splash' && <FullSplashImage />}
        {type === 'spinner' && <Spinner />}
      </Container>
    </Portal>
  );
}
