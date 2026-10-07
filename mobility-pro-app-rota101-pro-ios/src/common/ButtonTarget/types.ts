export interface ButtonTargetProps {
  text: string;
  visible: boolean;
  setVisible: (val: boolean) => void
  callback?: () => void;
  seconds?: number;
  secondsToHide?: number;
}
