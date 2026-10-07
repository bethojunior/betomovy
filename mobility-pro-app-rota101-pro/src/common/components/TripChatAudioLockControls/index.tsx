import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { formatRecordTime } from '../../../utils/formatRecordTime';
import { translate } from '../../../client/locales';
import {
  CardContainer,
  CancelBtn,
  AudioInfo,
  PulsingDot,
  WaveBar,
  TimerValue,
  SendBtn,
} from './styles';
import type { TripChatAudioLockControlsProps } from './types';

const WAVE_BARS = [
  { barHeight: 10, delay: 0 },
  { barHeight: 16, delay: 120 },
  { barHeight: 14, delay: 240 },
  { barHeight: 8, delay: 120 },
];

export function TripChatAudioLockControls({
  recordTime,
  onCancel,
  onSend,
  sendDisabled = false,
}: TripChatAudioLockControlsProps) {
  const theme = useTheme();

  return (
    <CardContainer>
      <CancelBtn
        onPress={onCancel}
        activeOpacity={0.8}
        accessibilityLabel={translate('trip.chat.cancel_audio_a11y')}
      >
        <Ionicons name="close" size={22} color="#FF3B30" />
      </CancelBtn>

      <AudioInfo>
        <PulsingDot
          from={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0.2, scale: 0.6 }}
          transition={{
            type: 'timing',
            duration: 800,
            loop: true,
            repeatReverse: true,
          }}
        />
        {WAVE_BARS.map(({ barHeight, delay }, i) => (
          <WaveBar
            key={i}
            barHeight={barHeight}
            from={{ scaleY: 0.35 }}
            animate={{ scaleY: 1 }}
            transition={{
              type: 'timing',
              duration: 600,
              loop: true,
              repeatReverse: true,
              delay,
            }}
          />
        ))}
        <TimerValue>{formatRecordTime(recordTime)}</TimerValue>
      </AudioInfo>

      <SendBtn
        onPress={onSend}
        disabled={sendDisabled}
        activeOpacity={0.8}
        accessibilityLabel={translate('trip.chat.send_audio_a11y')}
      >
        <MaterialIcon name="send" size={20} color={theme.colors.primaryText} />
      </SendBtn>
    </CardContainer>
  );
}
