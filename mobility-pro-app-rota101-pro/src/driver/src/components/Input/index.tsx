import {Controller} from 'react-hook-form';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {Feather} from '@expo/vector-icons';

import {Container, Content, Error} from './styles';
import theme from '../../styles/theme';
import {If} from '../If';

interface InputProps {
  placeholder?: string;
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
  ...rest
}: InputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}}) => (
        <>
          <Container>
            <If condition={icon === true}>
              <Feather name="mail" size={21} color={theme.colors.primary} />
            </If>
            <Content
              icon={icon}
              placeholder={placeholder}
              autoComplete="off"
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
