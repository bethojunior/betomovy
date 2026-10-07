import {lighten} from 'polished';
import React, {useEffect, useRef} from 'react';
import {Animated, View, Text, StyleSheet} from 'react-native';
import theme from '../../styles/theme';

interface Props {
  layout: {
    width: number;
    height: number;
  };
}

const AnimationOnPulseBgWhiteOnCentralized = ({layout}: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true, // Utilize o driver nativo
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true, // Utilize o driver nativo
        }),
      ]),
    ).start();
  }, []);

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [layout.height, 0], // Faça o borderRadius variar de 8 até 0
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.8], // Faça o pulso variar de escala normal (1) até o dobro do tamanho (2)
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.6],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{scale}],
            borderRadius,
            opacity,
            width: layout?.width,
            height: layout?.height,
          }, // Aplicar o valor interpolado de borderRadius
          {
            backgroundColor: lighten(0.4, theme.colors.primary),
          },
        ]}
      />
      <View style={styles.modal}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  pulse: {
    position: 'absolute',
    top: 300,
    borderRadius: 500,
  },
  modal: {
    position: 'absolute',
  },
});

export default AnimationOnPulseBgWhiteOnCentralized;
