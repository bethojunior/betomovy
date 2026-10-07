import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../client/locales';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/** Vinheta escura com um recorte oval + contorno, no padrão de guia facial dos apps de verificação atuais. */
export const Mask = () => {
  const theme = useTheme();
  const faceWidth = windowWidth * 0.65;
  const faceHeight = windowHeight * 0.55;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2 - RFValue(20);
  const rx = faceWidth / 2;
  const ry = faceHeight / 2;

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <Path
          d={`M0,0H${windowWidth}V${windowHeight}H0Z M${centerX},${centerY} m-${rx},0 a ${rx},${ry} 0 1,0 ${faceWidth},0 a ${rx},${ry} 0 1,0 -${faceWidth},0`}
          fill="rgba(0, 0, 0, 0.55)"
        />
        <Ellipse
          cx={centerX}
          cy={centerY}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={theme.colors.white}
          strokeWidth={RFValue(2.5)}
          strokeDasharray={`${RFValue(10)}, ${RFValue(8)}`}
        />
      </Svg>

      <Text style={[styles.hint, { top: centerY + ry + RFValue(24), color: theme.colors.white }]}>
        {translate('documents.face_guide_hint')}
      </Text>
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
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: RFValue(14),
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: RFValue(24),
  },
});
