import {useState} from 'react';
import {Controller} from 'react-hook-form';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {Feather} from '@expo/vector-icons';
import Icon from '@expo/vector-icons/Ionicons';

import {Container, Content, Error, TouchShowPassword} from './styles';
import theme from '../../styles/theme';
import {If} from '../If';

interface InputProps {
  placeholder: string;
  icon?: boolean;
  keyboardType?: KeyboardTypeOptions;
  ref?: any;
  error?: string;
  control: any;
  returnKeyType?: ReturnKeyType;
  name: string;
  maxLength?: number;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  defaultValue?: string;
  color?: string;
}

export function InputPassword({
  placeholder,
  keyboardType,
  error,
  icon,
  control,
  name,
  maxLength,
  color,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, value}}) => (
          <Container color={color}>
            <If condition={icon === true}>
              <Feather
                name="lock"
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
              secureTextEntry={!showPassword}
              keyboardType={keyboardType}
              returnKeyType="done"
              value={value}
              maxLength={maxLength}
              autoCapitalize="none"
              {...rest}
            />

            <TouchShowPassword
              activeOpacity={1}
              icon={icon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                color={color ? color : theme.colors.primary}
                size={21}
              />
            </TouchShowPassword>
          </Container>
        )}
      />
      {error && <Error>{error}</Error>}
    </>
  );
}
