export interface CapturedPhoto {
  uri: string;
}

export interface FaceDetectorScreenProps {
  visible: boolean;
  onClose?: () => void;
  sendPhoto?: (uri: string) => void | Promise<void>;
  setImage: (photo: CapturedPhoto | null) => void;
}
