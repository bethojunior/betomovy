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

const BrandDefault = () => {
  // Animação sincronizada idêntica ao vídeo
  const iconFade = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.7)).current;
  const iconTranslateX = useRef(new Animated.Value(0)).current;

  const textFade = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(24)).current;

  const pulseScale = useRef(new Animated.Value(0.85)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // 1. Pulso das ondas concêntricas
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.35,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1800,
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

    // 2. Animação Sequencial do Logo:
    // Fase 1: Ícone aparece no centro com zoom e fade
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconFade, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      // Pequena pausa no centro como no vídeo
      Animated.delay(200),
      // Fase 2: Ícone desliza para a esquerda e o texto Movy branco surge à direita
      Animated.parallel([
        Animated.timing(iconTranslateX, {
          toValue: -52,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 0,
          duration: 750,
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

      {/* Container Central com Ícone + Texto Movy em Branco */}
      <View style={brand.logoContainer}>
        {/* Ícone Movy colorido */}
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

        {/* Texto Movy Branco idêntico ao vídeo */}
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
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    height: 140,
  },
  icon: {
    width: 88,
    height: 70,
  },
  textWhite: {
    width: 160,
    height: 56,
    marginLeft: 8,
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
