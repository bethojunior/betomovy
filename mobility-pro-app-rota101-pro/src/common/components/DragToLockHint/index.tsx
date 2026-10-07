import { Ionicons } from '@expo/vector-icons';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { translate } from '../../../client/locales';
import { ArrowContainer, ArrowText, wrapperStyle } from './styles';

interface Props {
  animatedStyle: AnimatedStyle<ViewStyle>;
}

// Dica "arraste pra travar" do gravador de áudio — sempre montada, opacidade
// controlada via SharedValue (fade in/out). Compartilhada entre motorista e passageiro.
export function DragToLockHint({ animatedStyle }: Props) {
  return (
    <Animated.View style={[wrapperStyle, animatedStyle]}>
      <ArrowContainer>
        <Ionicons name="arrow-back" size={16} color="white" />
        <ArrowText>{translate('trip.chat.drag_to_lock')}</ArrowText>
      </ArrowContainer>
    </Animated.View>
  );
}
