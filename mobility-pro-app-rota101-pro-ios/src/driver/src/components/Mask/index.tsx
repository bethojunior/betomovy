import {Dimensions, StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Mask = () => {
  const verticalScale = 0.7; // Esta variável pode ser ajustada para diminuir o tamanho verticalmente

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <Path
          d={`M0,0H${windowWidth}V${windowHeight}H0Z M${windowWidth / 2},${
            windowHeight / 2
          } m-${windowWidth / 3},0 a ${windowWidth / 3},${
            (windowHeight / 3) * verticalScale // Agora a escala vertical é aplicada aqui
          } 0 1,0 ${(windowWidth * 2) / 3},0 a ${windowWidth / 3},${
            (windowHeight / 3) * verticalScale // E aqui
          } 0 1,0 -${(windowWidth * 2) / 3},0`}
          fill="rgba(0, 0, 0, 0.5)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
