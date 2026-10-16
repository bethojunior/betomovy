export interface ZafiraApiData {
  nome: string;
  cpf: string;
  nascimento: string;
  mae: string;
}

export interface ZafiraValidationResultModalProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  isMatch: boolean;
  apiData?: ZafiraApiData;
  error?: string | null;
}
