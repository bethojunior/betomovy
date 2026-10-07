import React, {FC} from 'react';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';

import {Controller} from 'react-hook-form';
import {Input, Error} from './styles';

interface InputProps {
  placeholder?: string;
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

const InputForm: FC<InputProps> = ({
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  control,
  name,
  maxLength,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}}) => (
        <>
          <Input
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
          {error && <Error>{error}</Error>}
        </>
      )}
    />
  );
};

export default InputForm;
