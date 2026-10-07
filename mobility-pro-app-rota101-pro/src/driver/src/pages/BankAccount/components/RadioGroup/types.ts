export interface RadioOption<T extends string> {
  value: T;
  label: string;
}

export interface RadioGroupProps<T extends string> {
  value?: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
}
