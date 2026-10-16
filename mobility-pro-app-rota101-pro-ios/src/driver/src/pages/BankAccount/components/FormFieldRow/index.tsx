import { FormFieldRowProps } from './types';
import {
  EditField,
  EditLabel,
  EditLabelRow,
  FieldErrorText,
  IconBadge,
  Input,
  ReadLabel,
  ReadLabelRow,
  ReadRow,
  ReadValue,
} from './styles';

/** Campo do formulário: linha rótulo/valor em leitura, input com borda em edição. */
export function FormFieldRow({
  label,
  value,
  editable,
  required,
  keyboardType = 'default',
  icon,
  error,
  onChangeText,
  onBlur,
  onFocus,
}: FormFieldRowProps) {
  if (!editable) {
    return (
      <ReadRow>
        <ReadLabelRow>
          {icon && <IconBadge>{icon}</IconBadge>}
          <ReadLabel>{label}</ReadLabel>
        </ReadLabelRow>
        <ReadValue numberOfLines={1}>{value || '-'}</ReadValue>
      </ReadRow>
    );
  }

  return (
    <EditField>
      <EditLabelRow>
        {icon && <IconBadge>{icon}</IconBadge>}
        <EditLabel>{required ? `${label} *` : label}</EditLabel>
      </EditLabelRow>
      <Input
        value={value}
        keyboardType={keyboardType}
        hasError={!!error}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {!!error && <FieldErrorText>{error}</FieldErrorText>}
    </EditField>
  );
}
