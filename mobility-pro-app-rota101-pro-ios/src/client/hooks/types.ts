export type AudioDragLockParams = {
  disabled?: boolean;
  onRecordingStart: () => void;
  onRecordingEnd: () => void;
  onRecordingCancel: () => void;
};
