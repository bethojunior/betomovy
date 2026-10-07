export interface ZafiraValidationActionsProps {
  zafiraValidated: number;
  onValidate: () => void;
  loading: boolean;
  variant?: "default" | "compact";
}
