import {useState} from 'react';
import {Controller} from 'react-hook-form';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {Feather} from '@expo/vector-icons';
import Icon from '@expo/vector-icons/Ionicons';

import {Container, Content, Error, TouchShowPassword} from './styles';
import theme from '../../styles/theme';
import {If} from '../If';

interface InputProps {
  color?: string;
  icon?: boolean;
  placeholder: string;
  onChange?: (event) => void;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  maxLength?: number;
}

export const InputPasswordOnly = ({
  color,
  icon,
  placeholder,
  onChange,
  keyboardType,
  value,
  maxLength,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
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
  );
};
