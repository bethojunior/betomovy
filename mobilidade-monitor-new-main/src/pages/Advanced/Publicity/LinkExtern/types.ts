export interface MenuAppsProps {
  id: number;
  description: string;
  link: string;
  menuAppTypeId: number;
  active: number;
  phoneNotification: string;
  created_at: string;
  menuAppTypeAction: number;
  linkImage: string;
  textImage: null;
  buttonsActions: ButtonsActions;
  buttonCta: ButtonCta;
  quantity: null;
  menu_app_type: MenuAppType;
}

export interface ButtonCta {
  link: string;
  name: string;
  checked: boolean;
}

export interface ButtonsActions {
  like: boolean;
  share: boolean;
}

export interface MenuAppType {
  id: number;
  name: string;
}

export interface TypesModalities {
  id: number;
  name: string;
}
