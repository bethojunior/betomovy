export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedToggleProps<T extends string> {
  value?: T;
  options: SegmentedToggleOption<T>[];
  onChange: (value: T) => void;
}
