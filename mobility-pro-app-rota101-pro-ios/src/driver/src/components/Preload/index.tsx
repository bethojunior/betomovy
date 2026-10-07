// @ts-nocheck
import {Modal, View} from 'react-native';
import {styles} from './styles';

import * as Animatable from 'react-native-animatable'

export default function Preload({visible}) {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Animatable.View
            style={styles.square1}
            animation="bounceInLeft"
            iterationCount="infinite"
            direction="alternate"
            duration={1500}
          />
          <Animatable.View
            style={styles.square2}
            animation="bounceInDown"
            iterationCount="infinite"
            direction="alternate"
            duration={1500}
          />
          <Animatable.View
            style={styles.square3}
            animation="bounceInUp"
            iterationCount="infinite"
            direction="alternate"
            duration={1500}
          />
          <Animatable.View
            style={styles.square4}
            animation="bounceInRight"
            iterationCount="infinite"
            direction="alternate"
            duration={1500}
          />
        </View>
      </View>
    </Modal>
  );
}
