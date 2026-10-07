export interface IManuContext {
  getMenuOptions: () => Promise<OptionsProps[]>;
  optionsMenu: OptionsProps[];
  setOptionsMenu: React.Dispatch<React.SetStateAction<OptionsProps[]>>;
  externalLink: ExternalLinkProps;
}

export interface ExternalLinkProps {
  description: string; 
  id: number;
  link?: string;
}

export interface OptionsProps {
  key: string;
  value: string;
  configTypeId: string;
  description: string;
}
