export interface IManuContext {
  getMenuOptions: () => Promise<OptionsProps[]>;
  optionsMenu: OptionsProps[];
  setOptionsMenu: React.Dispatch<React.SetStateAction<OptionsProps[]>>;
  externalLink: AdsProps;
}

export interface AdsProps {
  active: string;
  buttonCta?: ButtonCta;
  buttonsActions?: ButtonsActions;
  created_at: string;
  description: string;
  id: string;
  link: string;
  linkImage?: string;
  menuAppTypeAction?: string;
  menuAppTypeId?: string;
  phoneNotification?: string;
  quantity: null;
  textImage: string;
}

export interface ButtonCta {
  checked: boolean;
  link: string;
  name: string;
}

export interface ButtonsActions {
  like: boolean;
  share: boolean;
}

export interface OptionsProps {
  key: string;
  value: string;
  configTypeId: string;
  description: string;
}
