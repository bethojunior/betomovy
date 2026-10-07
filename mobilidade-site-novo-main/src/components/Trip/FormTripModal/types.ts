export interface FormTripModalProps {
  visible: boolean;
  setVisible: (val: boolean) => void;
  callback: (data: FormDataProps) => void;
}

export interface FormDataProps {
  name: string;
  phone: string;
  email: string;
  document: string;
}
