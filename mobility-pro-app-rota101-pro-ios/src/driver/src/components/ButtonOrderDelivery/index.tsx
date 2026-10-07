import React, {useEffect} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {OrderStatus} from '../CardOrder/Constants';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import theme from '../../styles/theme';

export const ReanimatedComponentDelivery = ({statusTrip, colors}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.2, {duration: 1000}), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const getStepIconName = step => {
    switch (step) {
      case OrderStatus.ORDER_ACCEPTED_DELIVERY_MAN:
        return 'local-shipping';
      case OrderStatus.ORDER_WITHDRAWING:
        return 'directions-car';
      case OrderStatus.ORDER_OUT_FOR_DELIVERY:
        return 'directions-bike';
      case OrderStatus.ORDER_ARRIVED:
        return 'home';
      case OrderStatus.ORDER_DELIVERED:
        return 'check';
      default:
        return 'error';
    }
  };

  return (
    <Animated.View
      style={[animatedStyles, {flexDirection: 'row', alignItems: 'center'}]}
    >
      <IfLoaderInsideScreen
        loading={statusTrip === 'loading'}
        color={theme.colors.primaryText}
      >
        <MaterialIcons
          name={getStepIconName(statusTrip)}
          size={30} // Tamanho do ícone
          color={colors.primaryText}
        />
      </IfLoaderInsideScreen>
    </Animated.View>
  );
};
