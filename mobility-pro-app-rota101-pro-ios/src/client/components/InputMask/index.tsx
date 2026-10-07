import React from 'react';
import {Control, Controller} from 'react-hook-form';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';

import {Container, Error} from './styles';

interface InputMaskProps {
  placeholder: string;
  ref?: any;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyType;
  error: string;
  control: Control;
  name: string;
  type: TextInputMaskTypeProp;
  value?: string | number;
  options?: TextInputMaskOptionProp;
  editable?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  onSubmitEditing?: () => void;
}

export function InputMask({
  placeholder,
  secureTextEntry,
  type,
  error,
  control,
  name,
  ref,
  keyboardType,
  editable,
  ...rest
}: InputMaskProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value, onBlur}}) => (
        <>
          <Container
            placeholder={placeholder}
            onChangeText={onChange}
            onBlur={onBlur}
            type={type}
            value={value}
            ref={ref}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            returnKeyType="done"
            autoCapitalize="none"
            editable={editable}
            options={{
              obfuscated: true,
            }}
            {...rest}
          />
          {error && <Error>{error}</Error>}
        </>
      )}
    />
  );
}
