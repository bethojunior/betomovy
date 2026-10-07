export interface IManuContext {
  getMenuOptions: () => Promise<OptionsProps[]>;
  optionsMenu: OptionsProps[];
  setOptionsMenu: (options: OptionsProps[]) => void;
}

export interface OptionsProps {
  key: string;
  value: string;
  configTypeId: string;
  description: string;
}
