declare type CheckBoxComponentRefProps = {
  getChecked: () => boolean;
  setCheckedData: (value: boolean) => void;
};

declare interface CheckBoxComponentProps {
  label?: string | null;
  title: string;
  defaultChecked?: boolean | null;
}
