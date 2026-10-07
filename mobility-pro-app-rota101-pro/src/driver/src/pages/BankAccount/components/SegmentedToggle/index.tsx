import { SegmentedToggleProps } from './types';
import { Option, OptionText, Row } from './styles';

/** Seletor de opções em botões (substitui Picker/Radio nativo, sem estilo no Android). */
export function SegmentedToggle<T extends string>({ value, options, onChange }: SegmentedToggleProps<T>) {
  return (
    <Row>
      {options.map(option => (
        <Option
          key={option.value}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
          activeOpacity={0.8}
        >
          <OptionText selected={value === option.value}>{option.label}</OptionText>
        </Option>
      ))}
    </Row>
  );
}
