export interface UpdatePasswordResult {
  status: boolean;
  message?: string;
}

export interface ChangePasswordModalProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  /** Valida a senha atual do usuário (cliente ou motorista) junto à API. */
  onCheckCurrentPassword: (currentPassword: string) => Promise<boolean>;
  /** Efetiva a troca de senha junto à API. */
  onUpdatePassword: (newPassword: string) => Promise<UpdatePasswordResult>;
}
