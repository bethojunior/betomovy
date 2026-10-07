import {Controller} from 'react-hook-form';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {If} from '../../modules/GetLight/components/If';

import {Container, Content, Error} from './styles';
import theme from '../../styles/theme';

interface InputProps {
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
      render={({field: {onChange, value}}) => (
        <>
          <Container color={color}>
            <If condition={icon === true}>
              <Feather
                name="mail"
                size={21}
                color={color ? color : theme.colors.primary}
              />
            </If>
            <Content
              icon={icon}
              placeholder={placeholder}
              autoComplete="off"
              color={color}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              returnKeyType="done"
              autoCapitalize="none"
              value={value}
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
