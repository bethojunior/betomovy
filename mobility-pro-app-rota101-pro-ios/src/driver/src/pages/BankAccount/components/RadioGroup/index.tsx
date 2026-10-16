import { RadioGroupProps } from './types';
import { OptionLabel, OptionRow, RadioDot, RadioDotFill, Row } from './styles';

/** Radio simples (bolinha + label) — pra escolhas com poucas opções, sem o peso visual de botões. */
export function RadioGroup<T extends string>({ value, options, onChange }: RadioGroupProps<T>) {
  return (
    <Row>
      {options.map(option => {
        const selected = value === option.value;
        return (
          <OptionRow key={option.value} onPress={() => onChange(option.value)} activeOpacity={0.7}>
            <RadioDot selected={selected}>{selected && <RadioDotFill />}</RadioDot>
            <OptionLabel selected={selected}>{option.label}</OptionLabel>
          </OptionRow>
        );
      })}
    </Row>
  );
}
