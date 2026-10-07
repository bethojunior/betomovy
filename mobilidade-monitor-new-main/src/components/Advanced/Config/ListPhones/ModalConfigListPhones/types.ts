export interface IModalConfigListPhonesProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  refetchAndResetStates: () => void;
}

export interface IResponseConfigListContactsProps {
  id: number;
  messageContacts: string;
  updated_at: string;
  created_at: string;
}
