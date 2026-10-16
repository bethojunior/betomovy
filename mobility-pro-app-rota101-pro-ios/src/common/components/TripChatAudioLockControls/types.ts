export interface TripChatAudioLockControlsProps {
  recordTime: number;
  onCancel: () => void;
  onSend: () => void;
  sendDisabled?: boolean;
}
