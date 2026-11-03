import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import {
  Container,
  Splash,
  SplashImage,
  SpinnerContainer,
} from './styles';

import { Portal } from 'react-native-paper';
import logo from '~/../assets/logo-on-dark.png';
import splash from '~/../assets/splash.png';

interface PreloadProps {
  visible: boolean;
  type?: 'brand' | 'spinner' | 'splash';
  transparent?: boolean;
}

const BrandDefault = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(line, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [fade, line]);

  return (
    <View style={brand.screen}>
      <Animated.Image
        source={logo}
        resizeMode="contain"
        style={[
          brand.logo,
          {
            opacity: fade,
            transform: [
              {
                translateY: fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      />
      <View style={brand.track}>
        <Animated.View
          style={[
            brand.route,
            {
              width: line.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 168],
              }),
            },
          ]}
        />
        <Animated.View style={[brand.pin, { opacity: line }]} />
      </View>
      <Text style={brand.tag}>Mobilidade urbana</Text>
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
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 92,
  },
  track: {
    marginTop: 28,
    width: 180,
    height: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  route: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2EE6D6',
  },
  pin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -4,
    backgroundColor: '#F5C542',
  },
  tag: {
    marginTop: 18,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    letterSpacing: 1.4,
  },
});

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
      <Container
        transparent={transparent}
        style={!transparent && type === 'brand' ? { backgroundColor: '#0B1220' } : undefined}
      >
        {type === 'brand' && <BrandDefault />}
        {type === 'splash' && <FullSplashImage />}
        {type === 'spinner' && <Spinner />}
      </Container>
    </Portal>
  );
}
