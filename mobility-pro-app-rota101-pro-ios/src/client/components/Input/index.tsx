import { Controller } from 'react-hook-form';
import { InputAccessoryView, KeyboardTypeOptions, ReturnKeyType } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Container, Content, Error } from './styles';
import theme from '../../styles/theme';

interface InputProps extends React.ComponentProps<typeof Content> {
  placeholder: string;
  icon?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  ref?: any;
  error?: string;
  control?: any;
  returnKeyType?: ReturnKeyType;
  name: string;
  maxLength?: number;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  defaultValue?: string;
  color?: string;
}

export function Input({
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  control,
  name,
  maxLength,
  icon,
  color,
  ...rest
}: InputProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field: { onChange, value, onBlur, name, ref } }) => (
        <>
          <Container color={color}>
            {icon && <Feather
              name="mail"
              size={21}
              color={color ? color : theme.colors.primary}
            />}

            <Content
              ref={ref}
              icon={icon}
              placeholder={placeholder}
              autoComplete="off"
              color={color}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              returnKeyType="done"
              autoCapitalize="none"
              value={value ?? ""}
              maxLength={maxLength}
              {...rest}
            />
          </Container>
          {error && <Error>{error}</Error>}
        </>
      )}
    />
  );
}
