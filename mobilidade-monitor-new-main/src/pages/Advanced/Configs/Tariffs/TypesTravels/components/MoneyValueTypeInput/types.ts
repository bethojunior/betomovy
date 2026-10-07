export interface MoneyValueTypeInputProps {
  label: string;
  value: string;
  onChangeValue: (maskedValue: string) => void;
  valueType: string;
  onChangeType: (type: string) => void;
  inputType?: string;
  autoComplete?: string;
  radioGroupName?: string;
}
